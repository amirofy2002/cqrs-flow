export interface IEventHandler<IEvent> {
  handle(event: IEvent): Promise<any>;
}
