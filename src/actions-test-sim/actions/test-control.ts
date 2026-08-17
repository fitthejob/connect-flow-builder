import { getTestActionDefinition } from "../../test-simulation/registry.js";
import type { TestAction } from "../../test-simulation/types.js";

export class EndTestActionBuilder {
  private readonly identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
    // Confirms the "TestControl" definition is registered — mirrors how
    // BaseActionBuilder looks up its definition in the flow-content builders,
    // even though there is no validation logic to run beyond this lookup.
    getTestActionDefinition("TestControl");
  }

  build(): TestAction {
    return {
      Identifier: this.identifier,
      Type: "TestControl",
      Parameters: {
        ActionType: "TestControl",
        Command: { Type: "EndTest" },
      },
      // No Transitions key -- EndTest is terminal by definition, and
      // CreateTestCase (Status: PUBLISHED) rejects an explicit
      // `{ NextAction: "" }` with InvalidActionProblem("Invalid next
      // action identifier: "), confirmed live 2026-08-17. Omitting the
      // key entirely is what the real API accepts.
    };
  }
}
