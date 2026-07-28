import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";
export class SetDisconnectFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
    disconnectFlowId(value) {
        return this.eventHook("CustomerRemaining", value);
    }
}
