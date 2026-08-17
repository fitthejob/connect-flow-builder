import { defineTestActionDefinition } from "./action-definition.js";
import type { TestActionDefinition } from "./action-definition.js";
import type { TestActionType } from "./types.js";

export const testControlDefinition = defineTestActionDefinition({
  type: "TestControl",
  description: "Controls test execution flow, e.g. ending the test.",
});

export const testActionDefinitions = [
  testControlDefinition,
] as const satisfies readonly TestActionDefinition[];

export const testActionRegistry = Object.freeze(
  Object.fromEntries(
    testActionDefinitions.map((definition) => [definition.type, definition]),
  ) as Record<TestActionType, TestActionDefinition>,
);

export function getTestActionDefinition(type: TestActionType): TestActionDefinition {
  return testActionRegistry[type];
}
