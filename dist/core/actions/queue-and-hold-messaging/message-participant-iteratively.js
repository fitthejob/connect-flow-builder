import { defineActionDefinition } from "../../action-definition.js";
export const messageParticipantIterativelyDefinition = defineActionDefinition({
    type: "MessageParticipantIteratively",
    requiredParameters: ["Messages"],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "queue-and-hold-messaging",
});
