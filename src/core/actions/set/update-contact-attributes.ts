import { defineActionDefinition } from "../../action-definition.js";

export const updateContactAttributesDefinition = defineActionDefinition({
  type: "UpdateContactAttributes",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "set",
});
