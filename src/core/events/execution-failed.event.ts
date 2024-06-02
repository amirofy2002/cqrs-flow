import { ICommand, IEvent } from "../types";

export class ExecutionFailedEvent implements IEvent {
  constructor(
    public readonly name: string,
    public readonly reason: string,
    public readonly source: IEvent | ICommand
  ) {}
}
