import { DisconnectParticipantActionBuilder, FlowBuilder, GetMetricDataActionBuilder, MessageParticipantActionBuilder, ResumeContactActionBuilder, UpdateContactDataActionBuilder, UpdateContactMediaStreamingBehaviorActionBuilder, UpdateContactRecordingAndAnalyticsBehaviorActionBuilder, } from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";
const greeting = new MessageParticipantActionBuilder("Greeting")
    .text("Preparing channel analytics controls.")
    .next("GetQueueMetrics")
    .build();
const getQueueMetrics = new GetMetricDataActionBuilder("GetQueueMetrics")
    .queueId("__QUEUE_ARN__")
    .voiceChannel()
    .next("SetContactData")
    .onError("Disconnect")
    .build();
const setContactData = new UpdateContactDataActionBuilder("SetContactData")
    .name("Support callback")
    .description("Analytics-enabled voice path")
    .languageCode("en-US")
    .customerId("$.Attributes.customerId")
    .reference("ticketId", "$.Attributes.ticketId")
    .voiceIdStreamingEnabled()
    .targetCurrent()
    .next("StartStreaming")
    .onError("Disconnect")
    .build();
const startStreaming = new UpdateContactMediaStreamingBehaviorActionBuilder("StartStreaming")
    .enabled()
    .participantCustomer("From", "To")
    .next("SetRecordingAndAnalytics")
    .onError("Disconnect")
    .build();
const setRecordingAndAnalytics = new UpdateContactRecordingAndAnalyticsBehaviorActionBuilder("SetRecordingAndAnalytics")
    .voiceRecording(["Agent", "Customer"], "Enabled")
    .voiceAnalyticsBehavior({
    Enabled: "True",
    AnalyticsLanguage: "en-US",
    AnalyticsModes: ["RealTime", "AutomatedInteraction"],
    SentimentConfiguration: {
        Enabled: "True",
    },
    SummaryConfiguration: {
        SummaryModes: ["AutomatedInteraction"],
    },
})
    .next("ResumeContact")
    .onError("Disconnect", "NoMatchingError")
    .onError("Disconnect", "ChannelMismatch")
    .build();
const resumeContact = new ResumeContactActionBuilder("ResumeContact")
    .next("Disconnect")
    .onError("Disconnect")
    .build();
const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();
export const flow = new FlowBuilder("ChannelAnalytics")
    .startWith(greeting)
    .add(getQueueMetrics)
    .add(setContactData)
    .add(startStreaming)
    .add(setRecordingAndAnalytics)
    .add(resumeContact)
    .add(disconnect)
    .build();
printFlowWhenRunDirectly(import.meta.url, flow);
