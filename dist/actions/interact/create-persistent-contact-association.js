import { BaseActionBuilder } from "../common.js";
export { PERSISTENT_CONTACT_REHYDRATION_TYPES } from "../../core/action-constants.js";
export class CreatePersistentContactAssociationActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CreatePersistentContactAssociation");
    }
    rehydrationType(value) {
        return this.setParameter("RehydrationType", value);
    }
    entirePastSession() {
        return this.rehydrationType("ENTIRE_PAST_SESSION");
    }
    fromSegment() {
        return this.rehydrationType("FROM_SEGMENT");
    }
    sourceContactId(value) {
        return this.setParameter("SourceContactId", value);
    }
}
