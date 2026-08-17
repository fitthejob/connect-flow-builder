import type { TestActionType } from "./types.js";

export interface TestActionDefinition {
  readonly type: TestActionType;
  readonly description: string;
}

export function defineTestActionDefinition(
  definition: TestActionDefinition,
): TestActionDefinition {
  return definition;
}
