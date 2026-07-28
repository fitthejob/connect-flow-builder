import type { CheckVoiceIdOption } from "../../core/types.js";
import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";

export { CHECK_VOICE_ID_OPTIONS } from "../../core/action-constants.js";

export class CheckVoiceIdActionBuilder extends BaseActionBuilder<CheckVoiceIdActionBuilder> {
  constructor(id: string) {
    super(id, "CheckVoiceId");
  }

  option(value: CheckVoiceIdOption): this {
    return this.setParameter("CheckVoiceIdOption", value);
  }

  enrollmentStatus(): this {
    return this.option("enrollmentStatus");
  }

  voiceAuthentication(): this {
    return this.option("voiceAuthentication");
  }

  fraudDetection(): this {
    return this.option("fraudDetection");
  }

  whenStatusEquals(status: string, nextAction: string): this {
    this.when(equalsCondition(status), nextAction);
    return this;
  }
}
