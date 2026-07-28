import type { TransferParticipantToThirdPartyCallerId } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class TransferParticipantToThirdPartyActionBuilder extends BaseActionBuilder<TransferParticipantToThirdPartyActionBuilder> {
  constructor(id: string) {
    super(id, "TransferParticipantToThirdParty");
    this.setParameter("ThirdPartyConnectionTimeLimitSeconds", "30");
    this.setParameter("ContinueFlowExecution", "True");
  }

  thirdPartyPhoneNumber(value: string): this {
    return this.setParameter("ThirdPartyPhoneNumber", value);
  }

  connectionTimeLimitSeconds(value: number): this {
    return this.setParameter("ThirdPartyConnectionTimeLimitSeconds", String(value));
  }

  continueFlowExecution(enabled = true): this {
    return this.setParameter("ContinueFlowExecution", enabled ? "True" : "False");
  }

  thirdPartyDtmfDigits(value: string): this {
    return this.setParameter("ThirdPartyDTMFDigits", value);
  }

  callerId(name: string, number: string): this {
    return this.setParameter("CallerId", {
      Name: name,
      Number: number,
    } satisfies TransferParticipantToThirdPartyCallerId);
  }
}
