import { defineActionDefinition } from "../../action-definition.js";
export const getCalculatedAttributesForCustomerProfileDefinition = defineActionDefinition({
    type: "GetCalculatedAttributesForCustomerProfile",
    requiredParameters: ["ProfileRequestData"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
