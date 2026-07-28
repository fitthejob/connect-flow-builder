import { defineActionDefinition } from "../../action-definition.js";

export const transferToFlowDefinition = defineActionDefinition({
  type: "TransferToFlow",
  requiredParameters: ["ContactFlowId"],
  supportsNextAction: false,
  supportsConditions: false,
  supportsErrors: true,
  category: "terminate",
});
