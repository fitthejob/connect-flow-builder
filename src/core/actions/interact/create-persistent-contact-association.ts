import { defineActionDefinition } from "../../action-definition.js";

export const createPersistentContactAssociationDefinition =
  defineActionDefinition({
    type: "CreatePersistentContactAssociation",
    requiredParameters: ["RehydrationType", "SourceContactId"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "interact",
  });
