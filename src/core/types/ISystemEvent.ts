import { ICommand } from "./ICommand";

export interface ISystemEvent {
  timestamp: number;
  command: ICommand;
}
