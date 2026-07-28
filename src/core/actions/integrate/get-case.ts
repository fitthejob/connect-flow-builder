import { defineActionDefinition } from "../../action-definition.js";

export const getCaseDefinition = defineActionDefinition({
  type: "GetCase",
  requiredParameters: ["LinkContactToCase", "GetLastUpdatedCase", "CustomerId"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "integrate",
});
