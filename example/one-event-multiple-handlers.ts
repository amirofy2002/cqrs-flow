import {
  EventBusV2,
  EventHandlerV2,
  IEvent,
  IEventHandler,
} from "cqrs-flow";

class OrderCreated implements IEvent {
  name = "order.created";

  constructor(
    public readonly orderId: string,
    public readonly customerEmail: string
  ) {}
}

@EventHandlerV2(OrderCreated)
class SendConfirmationEmail implements IEventHandler<OrderCreated> {
  async handle(event: OrderCreated): Promise<string> {
    return `Sent confirmation for ${event.orderId} to ${event.customerEmail}`;
  }
}

@EventHandlerV2(OrderCreated)
class UpdateOrderReporting implements IEventHandler<OrderCreated> {
  async handle(event: OrderCreated): Promise<string> {
    return `Added ${event.orderId} to order reporting`;
  }
}

async function main() {
  // Each decorated handler registers when its class is instantiated.
  new SendConfirmationEmail();
  new UpdateOrderReporting();

  const eventBus = new EventBusV2();
  const results = await eventBus.handle<string>(
    new OrderCreated("order-123", "customer@example.com")
  );

  // Both handlers run concurrently; results retain registration order.
  console.log(results);
}

main().catch(console.error);
