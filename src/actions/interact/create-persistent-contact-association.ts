import type { PersistentContactRehydrationType } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { PERSISTENT_CONTACT_REHYDRATION_TYPES } from "../../core/action-constants.js";

export class CreatePersistentContactAssociationActionBuilder extends BaseActionBuilder<CreatePersistentContactAssociationActionBuilder> {
  constructor(id: string) {
    super(id, "CreatePersistentContactAssociation");
  }

  rehydrationType(value: PersistentContactRehydrationType): this {
    return this.setParameter("RehydrationType", value);
  }

  entirePastSession(): this {
    return this.rehydrationType("ENTIRE_PAST_SESSION");
  }

  fromSegment(): this {
    return this.rehydrationType("FROM_SEGMENT");
  }

  sourceContactId(value: string): this {
    return this.setParameter("SourceContactId", value);
  }
}
