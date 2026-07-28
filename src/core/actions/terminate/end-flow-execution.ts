import { defineActionDefinition } from "../../action-definition.js";

export const endFlowExecutionDefinition = defineActionDefinition({
  type: "EndFlowExecution",
  requiredParameters: [],
  supportsNextAction: false,
  supportsConditions: false,
  supportsErrors: false,
  category: "terminate",
});
