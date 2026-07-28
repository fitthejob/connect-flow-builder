import type { ChatBehaviorConfig, ScreenRecordingBehaviorConfig, VoiceBehaviorConfig } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactRecordingAndAnalyticsBehaviorActionBuilder extends BaseActionBuilder<UpdateContactRecordingAndAnalyticsBehaviorActionBuilder> {
    constructor(id: string);
    voiceBehavior(config: VoiceBehaviorConfig): this;
    chatBehavior(config: ChatBehaviorConfig): this;
    screenRecordingBehavior(config: ScreenRecordingBehaviorConfig): this;
    voiceRecording(recordedParticipants: Array<"Agent" | "Customer">, ivrRecordingBehavior?: "Enabled" | "Disabled"): this;
    voiceAnalyticsBehavior(config: NonNullable<VoiceBehaviorConfig["VoiceAnalyticsBehavior"]>): this;
}
