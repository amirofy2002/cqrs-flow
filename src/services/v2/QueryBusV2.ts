import { Subject, filter } from "rxjs";
import {
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
} from "../../core/types";
import { IQueryHandler } from "../../core/types/IQueryHandler";
import { IQuery } from "../../core/types/IQuery";

export class QueryBusV2 {
  private bus = new Subject<{ query: IQuery; resolve: (result: any) => any }>();
  private static handlerCache = new Map<string, IQueryHandler<IQuery>>();

  constructor() {
    this.init();
  }
  init() {
    console.debug("initialized query bus...");
    this.bus.subscribe(async ({ query, resolve }) => {
      const queryName = query.constructor.name;
      const handlerInstance = QueryBusV2.handlerCache.get(queryName);
      if (!handlerInstance) {
        console.error("no handler defined for this query ", queryName);
        return;
      }

      const result = await handlerInstance.run(query);
      resolve(result);
    });
  }

  run<K>(query: IQuery): Promise<K> {
    if (!query) {
      console.error("Invalid query: must implement IQuery. Received:", query);
      return Promise.reject("invalid query");
    }
    return new Promise<K>((resolve) => {
      this.bus.next({ query: query, resolve });
    });
  }

  public static register(query: string, handler: IQueryHandler<IQuery>): void {
    if (!handler || typeof handler.run !== "function") {
      console.error("Invalid handler: must implement run method.");
      return;
    }

    QueryBusV2.handlerCache.set(query, handler);
    console.log(`Handler registered for query: [${query}]`);
  }
}
