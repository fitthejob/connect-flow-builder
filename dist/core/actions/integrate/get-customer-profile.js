import { defineActionDefinition } from "../../action-definition.js";
export const getCustomerProfileDefinition = defineActionDefinition({
    type: "GetCustomerProfile",
    requiredParameters: ["ProfileRequestData"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
