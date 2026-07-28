import { defineActionDefinition } from "../../action-definition.js";

export const updateCaseDefinition = defineActionDefinition({
  type: "UpdateCase",
  requiredParameters: ["LinkContactToCase", "CaseId"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "integrate",
});
