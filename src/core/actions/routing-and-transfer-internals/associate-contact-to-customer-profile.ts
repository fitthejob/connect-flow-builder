import { defineActionDefinition } from "../../action-definition.js";

export const associateContactToCustomerProfileDefinition = defineActionDefinition({
  type: "AssociateContactToCustomerProfile",
  requiredParameters: ["ProfileRequestData"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "routing-and-transfer-internals",
});
