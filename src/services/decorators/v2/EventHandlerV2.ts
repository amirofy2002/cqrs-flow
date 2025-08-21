import {
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
} from "../../../core/types";
import { CommandBusV2 } from "../../v2/CommandBusV2";

export const EventHandlerV2 = (command: { new (...args: any[]): IEvent }) => {
  return function <T extends { new (...args: any[]): IEventHandler<IEvent> }>(
    constructor: T
  ) {
    return class extends constructor {
      commandBus = CommandBusV2.register(
        new command().constructor.name,
        this as any
      );
    };
  };
};
