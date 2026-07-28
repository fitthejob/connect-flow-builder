import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";
export class SetCustomerQueueFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
    customerQueueFlowId(value) {
        return this.eventHook("CustomerQueue", value);
    }
    customerQueueFlowArn(value) {
        return this.eventHook("CustomerQueue", value);
    }
}
