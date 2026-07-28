import { defineActionDefinition } from "../../action-definition.js";
export const checkVoiceIdDefinition = defineActionDefinition({
    type: "CheckVoiceId",
    requiredParameters: ["CheckVoiceIdOption"],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: true,
    category: "check",
});
