const assert = require("node:assert/strict");
const test = require("node:test");

const { EventBusV2 } = require("../dist");

test("runs handlers concurrently and returns results in registration order", async () => {
  class ConcurrentEvent {
    constructor() {
      this.name = "concurrent";
    }
  }

  const started = [];
  let finishFirst;
  let finishSecond;
  const firstHandler = {
    handle() {
      started.push("first");
      return new Promise((resolve) => {
        finishFirst = () => resolve("first-result");
      });
    },
  };
  const secondHandler = {
    handle() {
      started.push("second");
      return new Promise((resolve) => {
        finishSecond = () => resolve("second-result");
      });
    },
  };

  EventBusV2.register(ConcurrentEvent.name, firstHandler);
  EventBusV2.register(ConcurrentEvent.name, secondHandler);

  const resultPromise = new EventBusV2().handle(new ConcurrentEvent());
  assert.deepEqual(started, ["first", "second"]);

  finishSecond();
  finishFirst();

  assert.deepEqual(await resultPromise, ["first-result", "second-result"]);
});

test("returns an array for a single handler", async () => {
  class SingleHandlerEvent {
    constructor() {
      this.name = "single-handler";
    }
  }

  EventBusV2.register(SingleHandlerEvent.name, {
    async handle() {
      return "result";
    },
  });

  const results = await new EventBusV2().handle(new SingleHandlerEvent());

  assert.deepEqual(results, ["result"]);
});

test("does not register the same handler instance twice", async () => {
  class DuplicateHandlerEvent {
    constructor() {
      this.name = "duplicate-handler";
    }
  }

  let calls = 0;
  const handler = {
    async handle() {
      calls += 1;
      return calls;
    },
  };

  EventBusV2.register(DuplicateHandlerEvent.name, handler);
  EventBusV2.register(DuplicateHandlerEvent.name, handler);

  const results = await new EventBusV2().handle(new DuplicateHandlerEvent());

  assert.deepEqual(results, [1]);
  assert.equal(calls, 1);
});

test("rejects when any handler fails after starting every handler", async () => {
  class FailingEvent {
    constructor() {
      this.name = "failing";
    }
  }

  const started = [];
  EventBusV2.register(FailingEvent.name, {
    async handle() {
      started.push("failing");
      throw new Error("handler failed");
    },
  });
  EventBusV2.register(FailingEvent.name, {
    async handle() {
      started.push("successful");
      return "ok";
    },
  });

  await assert.rejects(
    new EventBusV2().handle(new FailingEvent()),
    /handler failed/
  );
  assert.deepEqual(started, ["failing", "successful"]);
});

test("rejects when an event has no handlers", async () => {
  class UnhandledEvent {
    constructor() {
      this.name = "unhandled";
    }
  }

  await assert.rejects(
    new EventBusV2().handle(new UnhandledEvent()),
    (error) => error === "no event handler found for this event: UnhandledEvent"
  );
});
