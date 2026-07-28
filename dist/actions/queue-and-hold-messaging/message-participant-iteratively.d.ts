import { BaseActionBuilder } from "../common.js";
export declare class MessageParticipantIterativelyActionBuilder extends BaseActionBuilder<MessageParticipantIterativelyActionBuilder> {
    constructor(id: string);
    addText(value: string): this;
    addPromptId(value: string): this;
    addSsml(value: string): this;
    addMedia(uri: string): this;
    interruptFrequencySeconds(value: number): this;
    onMessagesInterrupted(nextAction: string): this;
    private addMessage;
}
