const assert = require("node:assert/strict");
const test = require("node:test");

const { EventBusV2, EventHandlerV2 } = require("../dist");

test("routes multiple event types to one v2 handler", async () => {
  class CreatedEvent {
    constructor(id) {
      this.name = "created";
      this.id = id;
    }
  }

  class CancelledEvent {
    constructor(reason) {
      this.name = "cancelled";
      this.reason = reason;
    }
  }

  const received = [];
  class Handler {
    async handle(event) {
      received.push(event);
    }
  }

  const DecoratedHandler = EventHandlerV2([CreatedEvent, CancelledEvent])(
    Handler
  );
  new DecoratedHandler();

  const bus = new EventBusV2();
  const created = new CreatedEvent("order-1");
  const cancelled = new CancelledEvent("out-of-stock");

  await bus.handle(created);
  await bus.handle(cancelled);

  assert.deepEqual(received, [created, cancelled]);
});

test("keeps single-event registration compatible", async () => {
  class SingleEvent {
    constructor() {
      this.name = "single";
    }
  }

  const received = [];
  class Handler {
    async handle(event) {
      received.push(event);
    }
  }

  const DecoratedHandler = EventHandlerV2(SingleEvent)(Handler);
  new DecoratedHandler();

  const event = new SingleEvent();
  await new EventBusV2().handle(event);

  assert.deepEqual(received, [event]);
});

test("registers duplicate event types only once", () => {
  class DuplicateEvent {
    constructor(requiredValue) {
      this.name = requiredValue;
    }
  }

  class Handler {
    async handle() {}
  }

  const originalRegister = EventBusV2.register;
  const registrations = [];
  EventBusV2.register = (eventName) => registrations.push(eventName);

  try {
    const DecoratedHandler = EventHandlerV2([
      DuplicateEvent,
      DuplicateEvent,
    ])(Handler);
    new DecoratedHandler();
  } finally {
    EventBusV2.register = originalRegister;
  }

  assert.deepEqual(registrations, ["DuplicateEvent"]);
});
