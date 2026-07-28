import { equalsCondition } from "../../core/conditions.js";
import type { MessageLoopContent } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class MessageParticipantIterativelyActionBuilder extends BaseActionBuilder<MessageParticipantIterativelyActionBuilder> {
  constructor(id: string) {
    super(id, "MessageParticipantIteratively");
    this.setParameter("Messages", []);
  }

  addText(value: string): this {
    return this.addMessage({ Text: value });
  }

  addPromptId(value: string): this {
    return this.addMessage({ PromptId: value });
  }

  addSsml(value: string): this {
    return this.addMessage({ SSML: value });
  }

  addMedia(uri: string): this {
    return this.addMessage({
      Media: {
        Uri: uri,
        SourceType: "S3",
        MediaType: "Audio",
      },
    });
  }

  interruptFrequencySeconds(value: number): this {
    return this.setParameter("InterruptFrequencySeconds", value);
  }

  onMessagesInterrupted(nextAction: string): this {
    this.when(equalsCondition("MessagesInterrupted"), nextAction);
    return this;
  }

  private addMessage(message: MessageLoopContent): this {
    const messages = this.getParameter<MessageLoopContent[]>("Messages");
    messages.push(message);
    return this;
  }
}
