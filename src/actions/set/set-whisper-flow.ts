import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";

export class SetWhisperFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
  whisperFlowId(value: string): this {
    return this.eventHook("CustomerWhisper", value);
  }
}
