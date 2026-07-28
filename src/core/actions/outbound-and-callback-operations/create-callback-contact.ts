import { defineActionDefinition } from "../../action-definition.js";

export const createCallbackContactDefinition = defineActionDefinition({
  type: "CreateCallbackContact",
  requiredParameters: [
    "InitialCallDelaySeconds",
    "MaximumConnectionAttempts",
    "RetryDelaySeconds",
  ],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "outbound-and-callback-operations",
});
