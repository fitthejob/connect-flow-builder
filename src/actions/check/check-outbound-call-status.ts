import { equalsCondition } from "../../core/conditions.js";
import type { OutboundCallStatusOperand } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { OUTBOUND_CALL_STATUS_OPERANDS } from "../../core/action-constants.js";

export class CheckOutboundCallStatusActionBuilder extends BaseActionBuilder<CheckOutboundCallStatusActionBuilder> {
  constructor(id: string) {
    super(id, "CheckOutboundCallStatus");
  }

  onStatus(status: OutboundCallStatusOperand, nextAction: string): this {
    this.when(equalsCondition(status), nextAction);
    return this;
  }

  whenCallAnswered(nextAction: string): this {
    return this.onStatus("CallAnswered", nextAction);
  }

  whenVoicemailBeep(nextAction: string): this {
    return this.onStatus("VoicemailBeep", nextAction);
  }

  whenVoicemailNoBeep(nextAction: string): this {
    return this.onStatus("VoicemailNoBeep", nextAction);
  }

  whenNotDetected(nextAction: string): this {
    return this.onStatus("NotDetected", nextAction);
  }
}
