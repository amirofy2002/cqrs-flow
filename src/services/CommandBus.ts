import { Subject, filter } from "rxjs";
import { ICommand, ICommandHandler } from "../core/types";
import { Logger } from "./logger/logger";

const $executionContext = new Subject<Promise<any>>();

export class CommandBus {
  logger = new Logger(CommandBus.name);
  static $commands = new Subject<{
    name: string;
    command: ICommand;
    onSuccess: Subject<any>;
    onError: Subject<any>;
  }>();

  async publish(command: ICommand) {
    const name = command.constructor.name;
    const onError = new Subject();
    const onSuccess = new Subject();
    const p = new Promise(async (resolve, reject) => {
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

  static handlerMap: Record<string, ICommandHandler<ICommand>> = {};

  register(name: string, handler: ICommandHandler<ICommand>) {
    this.logger.log({ name }, "registering command");
    CommandBus.handlerMap[name] = handler;
    return CommandBus.$commands.pipe(filter((x) => x.name == name));
  }
}

$executionContext.subscribe({
  next: (x) => x.catch((r) => new Error(r)),
  error: console.error,
});
