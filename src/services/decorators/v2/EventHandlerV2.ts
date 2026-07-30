import { IEvent, IEventHandler } from "../../../core/types";
import { EventBusV2 } from "../../v2/EventBusV2";

type EventConstructor = { new (...args: any[]): IEvent };

export const EventHandlerV2 = (
  event: EventConstructor | readonly EventConstructor[]
) => {
  const events = [...new Set(Array.isArray(event) ? event : [event])];

  return function <T extends { new (...args: any[]): IEventHandler<IEvent> }>(
    constructor: T
  ) {
    return class extends constructor {
      _____eventBus_____ = events.forEach((eventType) =>
        EventBusV2.register(eventType.name, this)
      );
    };
  };
};
