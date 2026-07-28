import { defineActionDefinition } from "../../action-definition.js";

export const updateContactRecordingBehaviorDefinition = defineActionDefinition({
  type: "UpdateContactRecordingBehavior",
  requiredParameters: ["RecordingBehavior", "AnalyticsBehavior"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "analyze",
});
