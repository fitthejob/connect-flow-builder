import { defineActionDefinition } from "../../action-definition.js";
export const checkHoursOfOperationDefinition = defineActionDefinition({
    type: "CheckHoursOfOperation",
    requiredParameters: [],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "check",
});
