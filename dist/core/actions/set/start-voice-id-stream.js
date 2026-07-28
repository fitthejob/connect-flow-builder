import { defineActionDefinition } from "../../action-definition.js";
export const startVoiceIdStreamDefinition = defineActionDefinition({
    type: "StartVoiceIdStream",
    requiredParameters: [],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "set",
});
