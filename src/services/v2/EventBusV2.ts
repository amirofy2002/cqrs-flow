import { Subject, filter } from "rxjs";
import {
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
} from "../../core/types";

export class EventBusV2<T extends { new (...args: any[]): IEvent }> {
  private bus = new Subject<T>();
  private static handlerCache = new Map<string, IEventHandler<any>>();

  constructor() {
    this.init();
  }
  init() {
    console.log("initialized command bus...");
    this.bus.subscribe((ev: T) => {
      const commandName = ev.constructor.name;
      const handlerInstance = EventBusV2.handlerCache.get(commandName);
      if (!handlerInstance) {
        console.error("no handler defined for this event ", commandName);
        return;
      }
      console.log("executing...");

      handlerInstance.handle(ev);
    });
  }

  handle(cmd: T): void {
    if (!cmd) {
      console.error("Invalid command: must implement IEvent. Received:", cmd);
      return;
    }
    this.bus.next(cmd);
  }

  public static register<T>(command: string, handler: IEventHandler<T>): void {
    if (!handler || typeof handler.handle !== "function") {
      console.error("Invalid handler: must implement handle method.");
      return;
    }

    EventBusV2.handlerCache.set(command, handler);
    console.log(`Handler registered for event: [${command}]`);
  }
}
