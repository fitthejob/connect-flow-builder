import { BaseActionBuilder } from "../common.js";
export class UpdateContactRecordingAndAnalyticsBehaviorActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactRecordingAndAnalyticsBehavior");
    }
    voiceBehavior(config) {
        delete this.parameters.ChatBehavior;
        return this.setParameter("VoiceBehavior", config);
    }
    chatBehavior(config) {
        delete this.parameters.VoiceBehavior;
        return this.setParameter("ChatBehavior", config);
    }
    screenRecordingBehavior(config) {
        return this.setParameter("ScreenRecordingBehavior", config);
    }
    voiceRecording(recordedParticipants, ivrRecordingBehavior) {
        const voiceBehavior = this.getParameter("VoiceBehavior")
            ?? {};
        voiceBehavior.VoiceRecordingBehavior = {
            RecordedParticipants: recordedParticipants,
            ...(ivrRecordingBehavior ? { IVRRecordingBehavior: ivrRecordingBehavior } : {}),
        };
        delete this.parameters.ChatBehavior;
        return this.setParameter("VoiceBehavior", voiceBehavior);
    }
    voiceAnalyticsBehavior(config) {
        const voiceBehavior = this.getParameter("VoiceBehavior")
            ?? {};
        voiceBehavior.VoiceAnalyticsBehavior = config;
        delete this.parameters.ChatBehavior;
        return this.setParameter("VoiceBehavior", voiceBehavior);
    }
}
