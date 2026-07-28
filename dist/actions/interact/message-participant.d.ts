import { BaseActionBuilder } from "../common.js";
export declare class MessageParticipantActionBuilder extends BaseActionBuilder<MessageParticipantActionBuilder> {
    constructor(id: string);
    text(value: string): this;
}
