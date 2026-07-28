import { defineActionDefinition } from "../../action-definition.js";

export const distributeByPercentageDefinition = defineActionDefinition({
  type: "DistributeByPercentage",
  requiredParameters: [],
  supportsNextAction: false,
  supportsConditions: true,
  supportsErrors: true,
  category: "logic",
});
