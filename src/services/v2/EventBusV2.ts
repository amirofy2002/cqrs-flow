import { Subject } from "rxjs";
import { IEvent, IEventHandler } from "../../core/types";

export class EventBusV2 {
  private bus = new Subject<{ event: IEvent; resolve: (result: any) => any }>();
  private static handlerCache = new Map<string, IEventHandler<IEvent>>();

  constructor() {
    this.init();
  }
  init() {
    console.log("initialized event bus...");
    this.bus.subscribe(async ({ event, resolve }) => {
      const commandName = event.constructor.name;
      const handlerInstance = EventBusV2.handlerCache.get(commandName);
      if (!handlerInstance) {
        console.error("no handler defined for this event ", commandName);
        return;
      }
      console.log("executing...");

      const result = await handlerInstance.handle(event);
      return resolve(result);
    });
  }

  handle<K>(event: IEvent): Promise<K> {
    if (!event) {
      console.error("Invalid event: must implement IEvent. Received:", event);
      return Promise.reject("invalid event");
    }
    return new Promise<K>((resolve) => {
      this.bus.next({ event: event, resolve });
    });
  }

  public static register(event: string, handler: IEventHandler<IEvent>): void {
    if (!handler || typeof handler.handle !== "function") {
      console.error("Invalid handler: must implement handle method.");
      return;
    }

    EventBusV2.handlerCache.set(event, handler);
    console.log(`Handler registered for event: [${event}]`);
  }
}
