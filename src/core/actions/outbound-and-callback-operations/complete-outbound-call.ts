import { defineActionDefinition } from "../../action-definition.js";

export const completeOutboundCallDefinition = defineActionDefinition({
  type: "CompleteOutboundCall",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: false,
  category: "outbound-and-callback-operations",
});
