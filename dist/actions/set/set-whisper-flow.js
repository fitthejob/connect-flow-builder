import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";
export class SetWhisperFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
    whisperFlowId(value) {
        return this.eventHook("CustomerWhisper", value);
    }
}
