import { Subject } from "rxjs";
import { IEvent, IEventHandler } from "../../core/types";

export class EventBusV2 {
  private bus = new Subject<{
    event: IEvent;
    resolve: (result: any) => any;
    reject: (err: string) => void;
  }>();
  private static handlerCache = new Map<string, IEventHandler<IEvent>>();

  constructor() {
    this.init();
  }
  init() {
    console.log("initializing event bus...");
    this.bus.subscribe(({ event, resolve, reject }) => {
      const eventName = event.constructor.name;
      const handlerInstance = EventBusV2.handlerCache.get(eventName);
      if (!handlerInstance) {
        console.error("no handler defined for this event ", eventName);
        reject(`no event handler found for this event: ${eventName}`);
        return;
      }

      handlerInstance.handle(event).catch(reject).then(resolve);
    });
    console.log("initialized event bus.");
  }

  handle<K>(event: IEvent): Promise<K> {
    if (!event) {
      console.error("Invalid event: must implement IEvent. Received:", event);
      return Promise.reject("invalid event");
    }
    return new Promise<K>((resolve, reject) => {
      this.bus.next({ event: event, resolve, reject });
    });
  }

  public static register(event: string, handler: IEventHandler<IEvent>): void {
    if (!handler || typeof handler.handle !== "function") {
      console.error("Invalid event handler: must implement handle method.");
      return;
    }

    EventBusV2.handlerCache.set(event, handler);
    console.log(`Event Handler registered for event: [${event}]`);
  }
}
