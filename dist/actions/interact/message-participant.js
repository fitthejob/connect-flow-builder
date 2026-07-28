import { BaseActionBuilder } from "../common.js";
export class MessageParticipantActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "MessageParticipant");
    }
    text(value) {
        return this.setParameter("Text", value);
    }
}
