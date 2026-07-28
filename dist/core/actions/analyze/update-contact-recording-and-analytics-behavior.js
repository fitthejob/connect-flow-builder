import { defineActionDefinition } from "../../action-definition.js";
export const updateContactRecordingAndAnalyticsBehaviorDefinition = defineActionDefinition({
    type: "UpdateContactRecordingAndAnalyticsBehavior",
    requiredParameters: [],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "analyze",
});
