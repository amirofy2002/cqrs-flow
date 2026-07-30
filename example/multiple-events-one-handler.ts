import {
  EventBusV2,
  EventHandlerV2,
  IEvent,
  IEventHandler,
} from "cqrs-flow";

class OrderCreated implements IEvent {
  name = "order.created";

  constructor(public readonly orderId: string) {}
}

class OrderCancelled implements IEvent {
  name = "order.cancelled";

  constructor(
    public readonly orderId: string,
    public readonly reason: string
  ) {}
}

@EventHandlerV2([OrderCreated, OrderCancelled])
class OrderEventHandler implements IEventHandler<IEvent> {
  async handle(event: IEvent): Promise<string> {
    if (event instanceof OrderCreated) {
      return `Created order ${event.orderId}`;
    }

    if (event instanceof OrderCancelled) {
      return `Cancelled order ${event.orderId}: ${event.reason}`;
    }

    throw new Error(`Unsupported event: ${event.name}`);
  }
}

async function main() {
  // Decorated handlers register when they are instantiated.
  new OrderEventHandler();

  const eventBus = new EventBusV2();
  const createdResults = await eventBus.handle<string>(
    new OrderCreated("order-123")
  );
  const cancelledResults = await eventBus.handle<string>(
    new OrderCancelled("order-123", "Customer request")
  );

  console.log(createdResults);
  console.log(cancelledResults);
}

main().catch(console.error);
