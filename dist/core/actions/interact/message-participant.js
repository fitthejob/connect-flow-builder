import { defineActionDefinition } from "../../action-definition.js";
export const messageParticipantDefinition = defineActionDefinition({
    type: "MessageParticipant",
    requiredParameters: [],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "interact",
});
