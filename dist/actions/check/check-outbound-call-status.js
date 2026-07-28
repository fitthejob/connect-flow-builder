import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export { OUTBOUND_CALL_STATUS_OPERANDS } from "../../core/action-constants.js";
export class CheckOutboundCallStatusActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CheckOutboundCallStatus");
    }
    onStatus(status, nextAction) {
        this.when(equalsCondition(status), nextAction);
        return this;
    }
    whenCallAnswered(nextAction) {
        return this.onStatus("CallAnswered", nextAction);
    }
    whenVoicemailBeep(nextAction) {
        return this.onStatus("VoicemailBeep", nextAction);
    }
    whenVoicemailNoBeep(nextAction) {
        return this.onStatus("VoicemailNoBeep", nextAction);
    }
    whenNotDetected(nextAction) {
        return this.onStatus("NotDetected", nextAction);
    }
}
