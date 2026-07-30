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
