import { BaseActionBuilder } from "../common.js";

export class GetParticipantInputActionBuilder extends BaseActionBuilder<GetParticipantInputActionBuilder> {
  constructor(id: string) {
    super(id, "GetParticipantInput");
    this.setParameter("InputTimeLimitSeconds", "5");
    this.setParameter("StoreInput", "False");
  }

  text(value: string): this {
    return this.setParameter("Text", value);
  }

  inputTimeLimitSeconds(value: number): this {
    return this.setParameter("InputTimeLimitSeconds", String(value));
  }

  lexBotAliasArn(value: string): this {
    return this.setParameter("LexV2Bot", value);
  }
}
