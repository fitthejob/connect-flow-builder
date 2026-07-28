import { defineActionDefinition } from "../../action-definition.js";
export const evaluateDataTableValuesDefinition = defineActionDefinition({
    type: "EvaluateDataTableValues",
    requiredParameters: ["DataTableId", "Queries"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
