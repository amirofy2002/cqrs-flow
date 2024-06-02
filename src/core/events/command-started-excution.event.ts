import { ICommand, IEvent } from "../types";
import { ISystemEvent } from "../types/ISystemEvent";

export class CommandStartedExecutionEvent implements ISystemEvent {
  constructor(public readonly name: string, command: ICommand) {}
}

export class CommandFinishedExecutionEvent implements ISystemEvent {
  constructor(public readonly name: string, command: ICommand, result: any) {}
}

export class CommandFinishedExecutionWithErrorEvent implements ISystemEvent {
  constructor(public readonly name: string, command: ICommand, error: Error) {}
}
