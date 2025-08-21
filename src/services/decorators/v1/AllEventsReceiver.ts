import { IEventHandler } from "../../../core/types";
import { ISystemEvent } from "../../../core/types/ISystemEvent";
import { InternalBus } from "../../InternalBus";

export function AllEventsReceiver() {
  return function <
    T extends { new (...args: any[]): IEventHandler<ISystemEvent> }
  >(constructor: T) {
    return class extends constructor {
      _internalBus = new InternalBus();
      _subscription = this._internalBus.$subject.subscribe((event) => {
        this.handle(event);
      });
    };
  };
}
