# cqrs-toolkit

a toolkit that eases managing cqrs events and commands

# Features:

---

- Event Bus:
- Command Bus:
- ICommand/IEvent interface

## Handling multiple events with v2

Pass multiple event classes to `EventHandlerV2` to route them to the same handler:

```ts
@EventHandlerV2([OrderCreated, OrderCancelled])
class OrderEventHandler implements IEventHandler<IEvent> {
  async handle(event: IEvent) {
    if (event instanceof OrderCreated) {
      // Handle creation.
    } else if (event instanceof OrderCancelled) {
      // Handle cancellation.
    }
  }
}
```

Passing a single event remains supported: `@EventHandlerV2(OrderCreated)`.

## Handling one event with multiple v2 handlers

Decorate multiple handler classes with the same event to fan out each dispatch:

```ts
@EventHandlerV2(OrderCreated)
class SendConfirmation implements IEventHandler<OrderCreated> {
  async handle(event: OrderCreated) {
    return `confirmation:${event.name}`;
  }
}

@EventHandlerV2(OrderCreated)
class UpdateReporting implements IEventHandler<OrderCreated> {
  async handle(event: OrderCreated) {
    return `reporting:${event.name}`;
  }
}

const results = await eventBus.handle<string>(new OrderCreated());
```

Handlers run concurrently. `results` contains their resolved values in registration
order. If any handler rejects, the dispatch rejects after all handlers have already
been started. Dispatching an event with no registered handlers also rejects.
