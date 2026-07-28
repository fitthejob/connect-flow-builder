import type { ContactEventHookType } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { CONTACT_EVENT_HOOK_TYPES } from "../../core/action-constants.js";
export declare class UpdateContactEventHooksActionBuilder extends BaseActionBuilder<UpdateContactEventHooksActionBuilder> {
    constructor(id: string);
    eventHook(type: ContactEventHookType, flowIdOrArn: string): this;
}
