import type {
  CompleteOutboundCallCallerId,
  CompleteOutboundCallVoiceConnector,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class CompleteOutboundCallActionBuilder extends BaseActionBuilder<CompleteOutboundCallActionBuilder> {
  constructor(id: string) {
    super(id, "CompleteOutboundCall");
  }

  callerIdNumber(value: string): this {
    return this.setParameter("CallerId", {
      Number: value,
    } satisfies CompleteOutboundCallCallerId);
  }

  voiceConnector(value: CompleteOutboundCallVoiceConnector): this {
    return this.setParameter("VoiceConnector", value);
  }

  chimeVoiceConnector({
    voiceConnectorArn,
    fromUser,
    toUser,
    userToUserInformation,
  }: {
    voiceConnectorArn: string;
    fromUser: string;
    toUser: string;
    userToUserInformation?: string;
  }): this {
    return this.voiceConnector({
      VoiceConnectorType: "ChimeConnector",
      VoiceConnectorArn: voiceConnectorArn,
      FromUser: fromUser,
      ToUser: toUser,
      UserToUserInformation: userToUserInformation,
    });
  }

  connectionTimeLimitSeconds(value: number): this {
    return this.setParameter("ConnectionTimeLimitSeconds", value);
  }
}
