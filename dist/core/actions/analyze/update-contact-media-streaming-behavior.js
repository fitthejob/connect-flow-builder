import { defineActionDefinition } from "../../action-definition.js";
export const updateContactMediaStreamingBehaviorDefinition = defineActionDefinition({
    type: "UpdateContactMediaStreamingBehavior",
    requiredParameters: ["MediaStreamingState", "Participants", "MediaStreamType"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "analyze",
});
