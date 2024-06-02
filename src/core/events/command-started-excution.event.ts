import { ICommand } from "../types";
import { ISystemEvent } from "../types/ISystemEvent";
export class CommandStartedExecutionEvent implements ISystemEvent {
  constructor(
    public readonly executionId: string,
    public readonly name: string,
    public readonly command: ICommand,
    public readonly timestamp: number
  ) {}
}

export class CommandFinishedExecutionEvent implements ISystemEvent {
  constructor(
    public readonly executionId: string,
    public readonly name: string,
    public readonly command: ICommand,
    public readonly result: any,
    public readonly timestamp: number
  ) {}
}

export class CommandFinishedExecutionWithErrorEvent implements ISystemEvent {
  constructor(
    public readonly executionId: string,
    public readonly name: string,
    public readonly command: ICommand,
    public readonly error: Error,
    public readonly timestamp: number
  ) {}
}
