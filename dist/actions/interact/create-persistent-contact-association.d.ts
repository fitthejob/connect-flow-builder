import type { PersistentContactRehydrationType } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { PERSISTENT_CONTACT_REHYDRATION_TYPES } from "../../core/action-constants.js";
export declare class CreatePersistentContactAssociationActionBuilder extends BaseActionBuilder<CreatePersistentContactAssociationActionBuilder> {
    constructor(id: string);
    rehydrationType(value: PersistentContactRehydrationType): this;
    entirePastSession(): this;
    fromSegment(): this;
    sourceContactId(value: string): this;
}
