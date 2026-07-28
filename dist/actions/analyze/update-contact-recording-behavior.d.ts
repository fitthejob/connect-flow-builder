import { BaseActionBuilder } from "../common.js";
type RecordedParticipant = "Agent" | "Customer";
type VoiceAnalyticsMode = "PostContact" | "RealTime";
export declare class UpdateContactRecordingBehaviorActionBuilder extends BaseActionBuilder<UpdateContactRecordingBehaviorActionBuilder> {
    constructor(id: string);
    recordParticipants(...participants: RecordedParticipant[]): this;
    enableIvrRecording(): this;
    analyticsEnabled(language: string): this;
    voiceAnalyticsModes(...modes: VoiceAnalyticsMode[]): this;
    postContactSummaryEnabled(): this;
    sentimentEnabled(): this;
}
export {};
