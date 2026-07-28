import type { CompleteOutboundCallVoiceConnector } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class CompleteOutboundCallActionBuilder extends BaseActionBuilder<CompleteOutboundCallActionBuilder> {
    constructor(id: string);
    callerIdNumber(value: string): this;
    voiceConnector(value: CompleteOutboundCallVoiceConnector): this;
    chimeVoiceConnector({ voiceConnectorArn, fromUser, toUser, userToUserInformation, }: {
        voiceConnectorArn: string;
        fromUser: string;
        toUser: string;
        userToUserInformation?: string;
    }): this;
    connectionTimeLimitSeconds(value: number): this;
}
