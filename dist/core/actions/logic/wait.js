import { defineActionDefinition } from "../../action-definition.js";
export const waitDefinition = defineActionDefinition({
    type: "Wait",
    requiredParameters: ["TimeoutSeconds"],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "logic",
});
