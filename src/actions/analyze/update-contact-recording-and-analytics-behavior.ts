import type {
  ChatBehaviorConfig,
  ScreenRecordingBehaviorConfig,
  VoiceBehaviorConfig,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class UpdateContactRecordingAndAnalyticsBehaviorActionBuilder extends BaseActionBuilder<UpdateContactRecordingAndAnalyticsBehaviorActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactRecordingAndAnalyticsBehavior");
  }

  voiceBehavior(config: VoiceBehaviorConfig): this {
    delete this.parameters.ChatBehavior;
    return this.setParameter("VoiceBehavior", config);
  }

  chatBehavior(config: ChatBehaviorConfig): this {
    delete this.parameters.VoiceBehavior;
    return this.setParameter("ChatBehavior", config);
  }

  screenRecordingBehavior(config: ScreenRecordingBehaviorConfig): this {
    return this.setParameter("ScreenRecordingBehavior", config);
  }

  voiceRecording(recordedParticipants: Array<"Agent" | "Customer">, ivrRecordingBehavior?: "Enabled" | "Disabled"): this {
    const voiceBehavior =
      this.getParameter<VoiceBehaviorConfig | undefined>("VoiceBehavior")
      ?? {};
    voiceBehavior.VoiceRecordingBehavior = {
      RecordedParticipants: recordedParticipants,
      ...(ivrRecordingBehavior ? { IVRRecordingBehavior: ivrRecordingBehavior } : {}),
    };
    delete this.parameters.ChatBehavior;
    return this.setParameter("VoiceBehavior", voiceBehavior);
  }

  voiceAnalyticsBehavior(config: NonNullable<VoiceBehaviorConfig["VoiceAnalyticsBehavior"]>): this {
    const voiceBehavior =
      this.getParameter<VoiceBehaviorConfig | undefined>("VoiceBehavior")
      ?? {};
    voiceBehavior.VoiceAnalyticsBehavior = config;
    delete this.parameters.ChatBehavior;
    return this.setParameter("VoiceBehavior", voiceBehavior);
  }
}
