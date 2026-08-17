import type { TestEvent } from "../../test-simulation/types.js";

export class MessageReceivedEventBuilder {
  private readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  build(): TestEvent {
    return {
      Type: "MessageReceived",
      Actor: "System",
      Properties: { Text: this.text },
      MatchingCriteria: "Similarity",
    };
  }
}
