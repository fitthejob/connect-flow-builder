import { BaseActionBuilder } from "../common.js";

type RecordedParticipant = "Agent" | "Customer";
type VoiceAnalyticsMode = "PostContact" | "RealTime";

export class UpdateContactRecordingBehaviorActionBuilder extends BaseActionBuilder<UpdateContactRecordingBehaviorActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactRecordingBehavior");
    this.setParameter("RecordingBehavior", {});
    this.setParameter("AnalyticsBehavior", {});
  }

  recordParticipants(...participants: RecordedParticipant[]): this {
    const recordingBehavior = this.getParameter<Record<string, unknown>>("RecordingBehavior");
    recordingBehavior.RecordedParticipants = participants;
    return this;
  }

  enableIvrRecording(): this {
    const recordingBehavior = this.getParameter<Record<string, unknown>>("RecordingBehavior");
    recordingBehavior.IVRRecordingBehavior = "Enabled";
    return this;
  }

  analyticsEnabled(language: string): this {
    const analyticsBehavior = this.getParameter<Record<string, unknown>>("AnalyticsBehavior");
    analyticsBehavior.Enabled = "True";
    analyticsBehavior.AnalyticsLanguage = language;
    return this;
  }

  voiceAnalyticsModes(...modes: VoiceAnalyticsMode[]): this {
    const analyticsBehavior = this.getParameter<Record<string, unknown>>("AnalyticsBehavior");
    analyticsBehavior.ChannelConfiguration = {
      Voice: {
        AnalyticsModes: modes,
      },
    };
    return this;
  }

  postContactSummaryEnabled(): this {
    const analyticsBehavior = this.getParameter<Record<string, unknown>>("AnalyticsBehavior");
    analyticsBehavior.SummaryConfiguration = {
      SummaryModes: ["PostContact"],
    };
    return this;
  }

  sentimentEnabled(): this {
    const analyticsBehavior = this.getParameter<Record<string, unknown>>("AnalyticsBehavior");
    analyticsBehavior.SentimentConfiguration = {
      Enabled: "True",
    };
    return this;
  }
}
