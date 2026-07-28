import { BaseActionBuilder } from "../common.js";
export class CompleteOutboundCallActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CompleteOutboundCall");
    }
    callerIdNumber(value) {
        return this.setParameter("CallerId", {
            Number: value,
        });
    }
    voiceConnector(value) {
        return this.setParameter("VoiceConnector", value);
    }
    chimeVoiceConnector({ voiceConnectorArn, fromUser, toUser, userToUserInformation, }) {
        return this.voiceConnector({
            VoiceConnectorType: "ChimeConnector",
            VoiceConnectorArn: voiceConnectorArn,
            FromUser: fromUser,
            ToUser: toUser,
            UserToUserInformation: userToUserInformation,
        });
    }
    connectionTimeLimitSeconds(value) {
        return this.setParameter("ConnectionTimeLimitSeconds", value);
    }
}
