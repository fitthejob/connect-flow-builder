import { defineActionDefinition } from "../../action-definition.js";

export const getMetricDataDefinition = defineActionDefinition({
  type: "GetMetricData",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "check",
});
