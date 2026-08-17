import type { TestEvent } from "../../test-simulation/types.js";

export class TestInitiatedEventBuilder {
  build(): TestEvent {
    return {
      Type: "TestInitiated",
      Actor: "System",
      Properties: {},
    };
  }
}
