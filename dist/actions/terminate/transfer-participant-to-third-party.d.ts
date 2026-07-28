import { BaseActionBuilder } from "../common.js";
export declare class TransferParticipantToThirdPartyActionBuilder extends BaseActionBuilder<TransferParticipantToThirdPartyActionBuilder> {
    constructor(id: string);
    thirdPartyPhoneNumber(value: string): this;
    connectionTimeLimitSeconds(value: number): this;
    continueFlowExecution(enabled?: boolean): this;
    thirdPartyDtmfDigits(value: string): this;
    callerId(name: string, number: string): this;
}
