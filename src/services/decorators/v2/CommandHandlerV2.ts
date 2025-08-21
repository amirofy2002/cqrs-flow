import { ICommand, ICommandHandler } from "../../../core/types";
import { CommandBusV2 } from "../../v2/CommandBusV2";

export const CommandHandlerV2 = (command: {
  new (...args: any[]): ICommand;
}) => {
  return function <
    T extends { new (...args: any[]): ICommandHandler<ICommand> }
  >(constructor: T) {
    return class extends constructor {
      commandBus = CommandBusV2.register(
        new command().constructor.name,
        this as any
      );
    };
  };
};
