export interface IQueryHandler<T> {
  run(query: T): Promise<any>;
}
