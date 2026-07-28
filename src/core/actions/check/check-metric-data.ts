import { defineActionDefinition } from "../../action-definition.js";

export const checkMetricDataDefinition = defineActionDefinition({
  type: "CheckMetricData",
  requiredParameters: ["MetricType"],
  supportsNextAction: false,
  supportsConditions: true,
  supportsErrors: true,
  category: "check",
});
