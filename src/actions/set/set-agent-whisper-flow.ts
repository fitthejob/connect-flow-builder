import { UpdateContactEventHooksActionBuilder } from "./update-contact-event-hooks.js";

export class SetAgentWhisperFlowActionBuilder extends UpdateContactEventHooksActionBuilder {
  whisperFlowId(value: string): this {
    return this.eventHook("AgentWhisper", value);
  }
}
