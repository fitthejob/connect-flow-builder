import { BaseActionBuilder } from "../common.js";
export class UpdateContactRecordingBehaviorActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactRecordingBehavior");
        this.setParameter("RecordingBehavior", {});
        this.setParameter("AnalyticsBehavior", {});
    }
    recordParticipants(...participants) {
        const recordingBehavior = this.getParameter("RecordingBehavior");
        recordingBehavior.RecordedParticipants = participants;
        return this;
    }
    enableIvrRecording() {
        const recordingBehavior = this.getParameter("RecordingBehavior");
        recordingBehavior.IVRRecordingBehavior = "Enabled";
        return this;
    }
    analyticsEnabled(language) {
        const analyticsBehavior = this.getParameter("AnalyticsBehavior");
        analyticsBehavior.Enabled = "True";
        analyticsBehavior.AnalyticsLanguage = language;
        return this;
    }
    voiceAnalyticsModes(...modes) {
        const analyticsBehavior = this.getParameter("AnalyticsBehavior");
        analyticsBehavior.ChannelConfiguration = {
            Voice: {
                AnalyticsModes: modes,
            },
        };
        return this;
    }
    postContactSummaryEnabled() {
        const analyticsBehavior = this.getParameter("AnalyticsBehavior");
        analyticsBehavior.SummaryConfiguration = {
            SummaryModes: ["PostContact"],
        };
        return this;
    }
    sentimentEnabled() {
        const analyticsBehavior = this.getParameter("AnalyticsBehavior");
        analyticsBehavior.SentimentConfiguration = {
            Enabled: "True",
        };
        return this;
    }
}
