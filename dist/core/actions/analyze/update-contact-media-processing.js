import { defineActionDefinition } from "../../action-definition.js";
export const updateContactMediaProcessingDefinition = defineActionDefinition({
    type: "UpdateContactMediaProcessing",
    requiredParameters: ["ChatProcessor"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "analyze",
});
