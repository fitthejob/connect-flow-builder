import { BaseActionBuilder } from "../common.js";
export { CONTACT_EVENT_HOOK_TYPES } from "../../core/action-constants.js";
export class UpdateContactEventHooksActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactEventHooks");
    }
    eventHook(type, flowIdOrArn) {
        return this.setParameter("EventHooks", {
            [type]: flowIdOrArn,
        });
    }
}
