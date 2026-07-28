import type { OutboundCallStatusOperand } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { OUTBOUND_CALL_STATUS_OPERANDS } from "../../core/action-constants.js";
export declare class CheckOutboundCallStatusActionBuilder extends BaseActionBuilder<CheckOutboundCallStatusActionBuilder> {
    constructor(id: string);
    onStatus(status: OutboundCallStatusOperand, nextAction: string): this;
    whenCallAnswered(nextAction: string): this;
    whenVoicemailBeep(nextAction: string): this;
    whenVoicemailNoBeep(nextAction: string): this;
    whenNotDetected(nextAction: string): this;
}
