import { defineActionDefinition } from "../../action-definition.js";
export const authenticateParticipantDefinition = defineActionDefinition({
    type: "AuthenticateParticipant",
    requiredParameters: [
        "CognitoConfiguration",
        "CustomerProfilesConfiguration",
        "TimeLimitMinutes",
    ],
    supportsNextAction: true,
    supportsConditions: true,
    supportsErrors: true,
    category: "interact",
});
