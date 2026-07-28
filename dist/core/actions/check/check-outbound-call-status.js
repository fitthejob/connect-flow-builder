import { defineActionDefinition } from "../../action-definition.js";
export const checkOutboundCallStatusDefinition = defineActionDefinition({
    type: "CheckOutboundCallStatus",
    requiredParameters: [],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "check",
});
