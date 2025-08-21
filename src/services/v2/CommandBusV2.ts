import { Subject, filter } from "rxjs";
import { ICommand, ICommandHandler } from "../../core/types";

export class CommandBusV2<T extends { new (...args: any[]): ICommand }> {
  private bus = new Subject<T>();
  private static handlerCache = new Map<string, ICommandHandler<any>>();

  constructor() {
    this.init();
  }
  init() {
    console.log("initialized command bus...");
    this.bus.subscribe((cmd: T) => {
      const commandName = cmd.constructor.name;
      const handlerInstance = CommandBusV2.handlerCache.get(commandName);
      if (!handlerInstance) {
        console.error("no handler defined for this command ", commandName);
        return;
      }
      console.log("executing...");

      handlerInstance.execute(cmd);
    });
  }

  execute(cmd: T): void {
    if (!cmd) {
      console.error("Invalid command: must implement ICommand. Received:", cmd);
      return;
    }
    this.bus.next(cmd);
  }

  public static register<T>(
    command: string,
    handler: ICommandHandler<T>
  ): void {
    if (!handler || typeof handler.execute !== "function") {
      console.error("Invalid handler: must implement execute method.");
      return;
    }

    CommandBusV2.handlerCache.set(command, handler);
    console.log(`Handler registered for command: [${command}]`);
  }
}
