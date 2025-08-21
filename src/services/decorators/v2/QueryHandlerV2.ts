import { IQuery } from "../../../core/types/IQuery";
import { IQueryHandler } from "../../../core/types/IQueryHandler";
import { QueryBusV2 } from "../../v2/QueryBusV2";

export const QueryHandlerV2 = (query: { new (...args: any[]): IQuery }) => {
  return function <T extends { new (...args: any[]): IQueryHandler<IQuery> }>(
    constructor: T
  ) {
    return class extends constructor {
      queryBus = QueryBusV2.register(new query().constructor.name, this as any);
    };
  };
};
