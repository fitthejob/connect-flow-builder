import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";

export class SetDisconnectFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
  disconnectFlowId(value: string): this {
    return this.eventHook("CustomerRemaining", value);
  }
}
