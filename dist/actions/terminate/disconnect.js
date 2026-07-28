import { BaseActionBuilder } from "../common.js";
export class DisconnectParticipantActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "DisconnectParticipant");
    }
}
