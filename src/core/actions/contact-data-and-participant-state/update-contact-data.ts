import { defineActionDefinition } from "../../action-definition.js";

export const updateContactDataDefinition = defineActionDefinition({
  type: "UpdateContactData",
  requiredParameters: ["TargetContact"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "contact-data-and-participant-state",
});
