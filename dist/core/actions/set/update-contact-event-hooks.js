import { defineActionDefinition } from "../../action-definition.js";
export const updateContactEventHooksDefinition = defineActionDefinition({
    type: "UpdateContactEventHooks",
    requiredParameters: ["EventHooks"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "set",
});
