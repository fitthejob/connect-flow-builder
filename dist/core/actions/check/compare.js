import { defineActionDefinition } from "../../action-definition.js";
export const compareDefinition = defineActionDefinition({
    type: "Compare",
    requiredParameters: ["ComparisonValue"],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "check",
});
