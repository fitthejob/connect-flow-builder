import type { CheckVoiceIdOption } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { CHECK_VOICE_ID_OPTIONS } from "../../core/action-constants.js";
export declare class CheckVoiceIdActionBuilder extends BaseActionBuilder<CheckVoiceIdActionBuilder> {
    constructor(id: string);
    option(value: CheckVoiceIdOption): this;
    enrollmentStatus(): this;
    voiceAuthentication(): this;
    fraudDetection(): this;
    whenStatusEquals(status: string, nextAction: string): this;
}
