import { defineActionDefinition } from "../../action-definition.js";

export const createCustomerProfileDefinition = defineActionDefinition({
  type: "CreateCustomerProfile",
  requiredParameters: ["ProfileRequestData"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "integrate",
});
