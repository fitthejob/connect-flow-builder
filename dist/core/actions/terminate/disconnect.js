import { defineActionDefinition } from "../../action-definition.js";
export const disconnectParticipantDefinition = defineActionDefinition({
    type: "DisconnectParticipant",
    requiredParameters: [],
    supportsNextAction: false,
    supportsConditions: false,
    supportsErrors: false,
    category: "terminate",
});
