import { Subject, filter } from "rxjs";
import { ICommand, ICommandHandler } from "../../core/types";
import { Logger } from "../logger/logger";
import { EventBus } from "./EventBus";
import { ExecutionFailedEvent } from "../../core/events/execution-failed.event";
import { InvocationException } from "../../core/exceptions/InvocationException";
import { InternalBus } from "../InternalBus";
import {
  CommandFinishedExecutionEvent,
  CommandFinishedExecutionWithErrorEvent,
  CommandStartedExecutionEvent,
} from "../../core/events/command-started-excution.event";
import { randomUUID } from "crypto";
export class CommandBus {
  logger = new Logger(CommandBus.name);
  static $commands = new Subject<{
    name: string;
    command: ICommand;
    onSuccess: Subject<any>;
    onError: Subject<string>;
  }>();

  async publish(command: ICommand) {
    const executionId = randomUUID();
    const name = command.constructor.name;
    const onError = new Subject<string>();
    const onSuccess = new Subject();

    const p = new Promise((resolve, reject) => {
      onSuccess.subscribe((x) => {
        InternalBus.subject.next(
          new CommandFinishedExecutionEvent(
            executionId,
            name,
            command,
            x,
            Date.now()
          )
        );
        return resolve(x);
      });
      onError.subscribe((x) => {
        InternalBus.subject.next(
          new CommandFinishedExecutionWithErrorEvent(
            executionId,
            name,
            command,
            new InvocationException(x),
            Date.now()
          )
        );
        return reject(new InvocationException(x));
      });
    });
    InternalBus.subject.next(
      new CommandStartedExecutionEvent(executionId, name, command, Date.now())
    );
    // $executionContext.next(p)
    CommandBus.$commands.next({ name, command, onError, onSuccess });
    return p;
  }

  find(name: string) {
    if (!CommandBus.handlerMap[name]) throw new Error("No handler found!");
    return CommandBus.handlerMap[name];
  }

  static readonly handlerMap: Record<string, ICommandHandler<ICommand>> = {};

  register(name: string, handler: ICommandHandler<ICommand>) {
    this.logger.log({ name }, "registering command");
    CommandBus.handlerMap[name] = handler;
    return CommandBus.$commands.pipe(filter((x) => x.name == name));
  }
}
