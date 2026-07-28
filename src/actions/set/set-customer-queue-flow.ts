import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";

export class SetCustomerQueueFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
  customerQueueFlowId(value: string): this {
    return this.eventHook("CustomerQueue", value);
  }

  customerQueueFlowArn(value: string): this {
    return this.eventHook("CustomerQueue", value);
  }
}
