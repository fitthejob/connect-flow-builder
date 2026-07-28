import { defineActionDefinition } from "../../action-definition.js";

export const transferContactToQueueDefinition = defineActionDefinition({
  type: "TransferContactToQueue",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "terminate",
});
