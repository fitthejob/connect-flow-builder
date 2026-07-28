import { defineActionDefinition } from "../../action-definition.js";

export const endFlowModuleExecutionDefinition = defineActionDefinition({
  type: "EndFlowModuleExecution",
  requiredParameters: [],
  supportsNextAction: false,
  supportsConditions: false,
  supportsErrors: false,
  category: "terminate",
});
