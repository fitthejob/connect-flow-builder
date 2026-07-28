import { defineActionDefinition } from "../../action-definition.js";

export const updatePreviousContactParticipantStateDefinition = defineActionDefinition({
  type: "UpdatePreviousContactParticipantState",
  requiredParameters: ["PreviousContactParticipantState"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "contact-data-and-participant-state",
});
