import { IEvent, IEventHandler } from "../../../core/types";
import { EventBusV2 } from "../../v2/EventBusV2";

export const EventHandlerV2 = (event: { new (...args: any[]): IEvent }) => {
  return function <T extends { new (...args: any[]): IEventHandler<IEvent> }>(
    constructor: T
  ) {
    return class extends constructor {
      _____eventBus_____ = EventBusV2.register(
        new event().constructor.name,
        this as any
      );
    };
  };
};
