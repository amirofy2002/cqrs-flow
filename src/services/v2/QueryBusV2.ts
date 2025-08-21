import { Subject, filter } from "rxjs";
import {
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
} from "../../core/types";
import { IQueryHandler } from "../../core/types/IQueryHandler";
import { IQuery } from "../../core/types/IQuery";

export class QueryBusV2<T extends { new (...args: any[]): IQuery }> {
  private bus = new Subject<T>();
  private static handlerCache = new Map<string, IQueryHandler<any>>();

  constructor() {
    this.init();
  }
  init() {
    console.log("initialized query bus...");
    this.bus.subscribe((ev: T) => {
      const commandName = ev.constructor.name;
      const handlerInstance = QueryBusV2.handlerCache.get(commandName);
      if (!handlerInstance) {
        console.error("no handler defined for this query ", commandName);
        return;
      }
      console.log("executing...");

      handlerInstance.run(ev);
    });
  }

  handle(cmd: T): void {
    if (!cmd) {
      console.error("Invalid query: must implement IQuery. Received:", cmd);
      return;
    }
    this.bus.next(cmd);
  }

  public static register<T>(query: string, handler: IQueryHandler<T>): void {
    if (!handler || typeof handler.run !== "function") {
      console.error("Invalid handler: must implement run method.");
      return;
    }

    QueryBusV2.handlerCache.set(query, handler);
    console.log(`Handler registered for query: [${query}]`);
  }
}
