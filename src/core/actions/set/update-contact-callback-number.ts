import { defineActionDefinition } from "../../action-definition.js";

export const updateContactCallbackNumberDefinition = defineActionDefinition({
  type: "UpdateContactCallbackNumber",
  requiredParameters: ["CallbackNumber"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "set",
});
