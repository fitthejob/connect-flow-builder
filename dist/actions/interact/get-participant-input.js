import { BaseActionBuilder } from "../common.js";
export class GetParticipantInputActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetParticipantInput");
        this.setParameter("InputTimeLimitSeconds", "5");
        this.setParameter("StoreInput", "False");
    }
    text(value) {
        return this.setParameter("Text", value);
    }
    inputTimeLimitSeconds(value) {
        return this.setParameter("InputTimeLimitSeconds", String(value));
    }
    lexBotAliasArn(value) {
        return this.setParameter("LexV2Bot", value);
    }
}
