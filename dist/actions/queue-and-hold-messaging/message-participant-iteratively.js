import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export class MessageParticipantIterativelyActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "MessageParticipantIteratively");
        this.setParameter("Messages", []);
    }
    addText(value) {
        return this.addMessage({ Text: value });
    }
    addPromptId(value) {
        return this.addMessage({ PromptId: value });
    }
    addSsml(value) {
        return this.addMessage({ SSML: value });
    }
    addMedia(uri) {
        return this.addMessage({
            Media: {
                Uri: uri,
                SourceType: "S3",
                MediaType: "Audio",
            },
        });
    }
    interruptFrequencySeconds(value) {
        return this.setParameter("InterruptFrequencySeconds", value);
    }
    onMessagesInterrupted(nextAction) {
        this.when(equalsCondition("MessagesInterrupted"), nextAction);
        return this;
    }
    addMessage(message) {
        const messages = this.getParameter("Messages");
        messages.push(message);
        return this;
    }
}
