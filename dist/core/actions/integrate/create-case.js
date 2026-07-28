import { defineActionDefinition } from "../../action-definition.js";
export const createCaseDefinition = defineActionDefinition({
    type: "CreateCase",
    requiredParameters: ["LinkContactToCase", "CaseTemplateId"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
