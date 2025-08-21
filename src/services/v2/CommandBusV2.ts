import { Subject, filter } from "rxjs";
import { ICommand, ICommandHandler } from "../../core/types";

export class CommandBusV2<T extends { new (...args: any[]): ICommand }> {
  private bus = new Subject<{ command: T; resolve: (result: any) => any }>();
  private static handlerCache = new Map<string, ICommandHandler<any>>();

  constructor() {
    this.init();
  }
  init() {
    console.debug("initialized command bus...");
    this.bus.subscribe(async ({ command, resolve }) => {
      const commandName = command.constructor.name;
      const handlerInstance = CommandBusV2.handlerCache.get(commandName);
      if (!handlerInstance) {
        console.error("no handler defined for this command ", commandName);
        return;
      }
      console.debug("executing...");

      const result = await handlerInstance.execute(command);
      resolve(result);
    });
  }

  execute<K>(cmd: T): Promise<K> {
    if (!cmd) {
      console.error("Invalid command: must implement ICommand. Received:", cmd);
      return Promise.reject("invalid command");
    }
    return new Promise<K>((resolve) => {
      this.bus.next({ command: cmd, resolve });
    });
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
    console.debug(`Handler registered for command: [${command}]`);
  }
}
