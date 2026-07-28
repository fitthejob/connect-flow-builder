import { defineActionDefinition } from "../../action-definition.js";

export const updateFlowLoggingBehaviorDefinition = defineActionDefinition({
  type: "UpdateFlowLoggingBehavior",
  requiredParameters: ["FlowLoggingBehavior"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: false,
  category: "analyze",
});
