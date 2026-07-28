import { defineActionDefinition } from "../../action-definition.js";
export const getParticipantInputDefinition = defineActionDefinition({
    type: "GetParticipantInput",
    requiredParameters: [],
    supportsNextAction: true,
    supportsConditions: true,
    supportsErrors: true,
    category: "interact",
});
