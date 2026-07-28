import { defineActionDefinition } from "../../action-definition.js";
export const showViewDefinition = defineActionDefinition({
    type: "ShowView",
    requiredParameters: ["ViewResource"],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "integrate",
});
