import { defineActionDefinition } from "../../action-definition.js";
export const updateContactTextToSpeechVoiceDefinition = defineActionDefinition({
    type: "UpdateContactTextToSpeechVoice",
    requiredParameters: ["TextToSpeechVoice"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "set",
});
