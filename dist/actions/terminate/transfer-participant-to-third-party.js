import { BaseActionBuilder } from "../common.js";
export class TransferParticipantToThirdPartyActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "TransferParticipantToThirdParty");
        this.setParameter("ThirdPartyConnectionTimeLimitSeconds", "30");
        this.setParameter("ContinueFlowExecution", "True");
    }
    thirdPartyPhoneNumber(value) {
        return this.setParameter("ThirdPartyPhoneNumber", value);
    }
    connectionTimeLimitSeconds(value) {
        return this.setParameter("ThirdPartyConnectionTimeLimitSeconds", String(value));
    }
    continueFlowExecution(enabled = true) {
        return this.setParameter("ContinueFlowExecution", enabled ? "True" : "False");
    }
    thirdPartyDtmfDigits(value) {
        return this.setParameter("ThirdPartyDTMFDigits", value);
    }
    callerId(name, number) {
        return this.setParameter("CallerId", {
            Name: name,
            Number: number,
        });
    }
}
