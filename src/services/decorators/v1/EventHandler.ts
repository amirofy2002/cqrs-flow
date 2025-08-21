import { IEvent, IEventHandler } from "../../../core/types";
import { EventBus } from "../../v1/EventBus";

export function EventHandler(event: IEvent) {
  return function <T extends { new (...args: any[]): IEventHandler<IEvent> }>(
    constructor: T
  ) {
    return class extends constructor {
      _eventBus = new EventBus();
      _subscription = this._eventBus.$subject.subscribe((cmd: any) => {
        if (cmd?.constructor?.name == `${event}`.split(" ")[1])
          this.handle(cmd);
      });
    };
  };
}
