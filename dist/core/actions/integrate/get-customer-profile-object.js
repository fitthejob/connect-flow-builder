import { defineActionDefinition } from "../../action-definition.js";
export const getCustomerProfileObjectDefinition = defineActionDefinition({
    type: "GetCustomerProfileObject",
    requiredParameters: ["ProfileRequestData"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
