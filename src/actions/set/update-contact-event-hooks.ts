import type { ContactEventHookType } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { CONTACT_EVENT_HOOK_TYPES } from "../../core/action-constants.js";

export class UpdateContactEventHooksActionBuilder extends BaseActionBuilder<UpdateContactEventHooksActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactEventHooks");
  }

  eventHook(type: ContactEventHookType, flowIdOrArn: string): this {
    return this.setParameter("EventHooks", {
      [type]: flowIdOrArn,
    });
  }
}
