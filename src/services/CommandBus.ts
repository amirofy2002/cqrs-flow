import { Subject, filter } from "rxjs";
import { ICommand, ICommandHandler } from "../core/types";
import { Logger } from "./logger/logger";
import { EventBus } from "./EventBus";
import { ExecutionFailedEvent } from "../core/events/execution-failed.event";

export class CommandBus {
  logger = new Logger(CommandBus.name);
  static $commands = new Subject<{
    name: string;
    command: ICommand;
    onSuccess: Subject<any>;
    onError: Subject<string>;
  }>();

  async publish(command: ICommand) {
    const name = command.constructor.name;
    const onError = new Subject<string>();
    const onSuccess = new Subject();
    const p = new Promise((resolve, reject) => {
      onSuccess.subscribe((x) => resolve(x));
      onError.subscribe((x) => reject(x));
    });
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
