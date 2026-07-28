import { defineActionDefinition } from "../../action-definition.js";
export const updateContactRoutingBehaviorDefinition = defineActionDefinition({
    type: "UpdateContactRoutingBehavior",
    requiredParameters: [],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: false,
    category: "set",
});
