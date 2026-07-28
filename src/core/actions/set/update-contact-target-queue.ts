import { defineActionDefinition } from "../../action-definition.js";

export const updateContactTargetQueueDefinition = defineActionDefinition({
  type: "UpdateContactTargetQueue",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "set",
});
