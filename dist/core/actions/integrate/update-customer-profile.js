import { defineActionDefinition } from "../../action-definition.js";
export const updateCustomerProfileDefinition = defineActionDefinition({
    type: "UpdateCustomerProfile",
    requiredParameters: ["ProfileRequestData"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
