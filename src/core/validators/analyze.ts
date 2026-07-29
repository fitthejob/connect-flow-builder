import type {
  FlowAction,
  FlowLoggingBehavior,
} from "../types.js";
import {
  FLOW_LOGGING_BEHAVIORS,
  MEDIA_DIRECTIONS,
  MEDIA_STREAMING_STATES,
  isObject,
  requireErrorTypes,
  requireNonEmptyStringParameter,
  validateTrueFalseField,
} from "./helpers.js";

export function validateUpdateContactMediaProcessingAction(action: FlowAction): void {
  const chatProcessor = action.parameters.ChatProcessor;
  if (!isObject(chatProcessor)) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactMediaProcessing" requires ChatProcessor to be an object.`,
    );
  }

  validateTrueFalseField(action, chatProcessor.ProcessingEnabled, "ChatProcessor.ProcessingEnabled");

  if (
    typeof chatProcessor.LambdaProcessorARN !== "string"
    || chatProcessor.LambdaProcessorARN.trim().length === 0
  ) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactMediaProcessing" requires ChatProcessor.LambdaProcessorARN to be a non-empty string.`,
    );
  }

  if ("ChatProcessorSettings" in chatProcessor) {
    const settings = chatProcessor.ChatProcessorSettings;
    if (!isObject(settings)) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactMediaProcessing" requires ChatProcessorSettings to be an object when provided.`,
      );
    }

    validateTrueFalseField(
      action,
      settings.DeliverUnprocessedMessages,
      "ChatProcessor.ChatProcessorSettings.DeliverUnprocessedMessages",
    );
  }

  requireErrorTypes(action, ["NoMatchingError", "ChannelMismatch"]);
}

export function validateUpdateContactMediaStreamingBehaviorAction(action: FlowAction): void {
  const mediaStreamingState = requireNonEmptyStringParameter(action, "MediaStreamingState");
  if (!MEDIA_STREAMING_STATES.has(mediaStreamingState)) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactMediaStreamingBehavior" requires MediaStreamingState to be Enabled or Disabled.`,
    );
  }

  if (action.parameters.MediaStreamType !== "Audio") {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactMediaStreamingBehavior" only supports MediaStreamType "Audio".`,
    );
  }

  const participants = action.parameters.Participants;
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactMediaStreamingBehavior" requires Participants to contain at least one entry.`,
    );
  }

  for (const participant of participants) {
    if (!isObject(participant) || participant.ParticipantType !== "Customer") {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactMediaStreamingBehavior" only supports ParticipantType "Customer".`,
      );
    }

    if (!Array.isArray(participant.MediaDirections) || participant.MediaDirections.length === 0) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactMediaStreamingBehavior" requires every participant to define at least one media direction.`,
      );
    }

    for (const direction of participant.MediaDirections) {
      if (typeof direction !== "string" || !MEDIA_DIRECTIONS.has(direction)) {
        throw new Error(
          `Action "${action.id}" of type "UpdateContactMediaStreamingBehavior" only supports media directions From and To.`,
        );
      }
    }
  }
}

export function validateUpdateContactRecordingAndAnalyticsBehaviorAction(action: FlowAction): void {
  const hasVoiceBehavior = isObject(action.parameters.VoiceBehavior);
  const hasChatBehavior = isObject(action.parameters.ChatBehavior);
  const hasScreenRecordingBehavior = isObject(action.parameters.ScreenRecordingBehavior);

  if (!hasVoiceBehavior && !hasChatBehavior && !hasScreenRecordingBehavior) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires at least one behavior object.`,
    );
  }

  if (hasVoiceBehavior && hasChatBehavior) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" cannot define both VoiceBehavior and ChatBehavior.`,
    );
  }

  if (hasVoiceBehavior) {
    validateVoiceBehavior(action, action.parameters.VoiceBehavior as Record<string, unknown>);
  }

  if (hasChatBehavior) {
    validateChatBehavior(action, action.parameters.ChatBehavior as Record<string, unknown>);
  }

  if (hasScreenRecordingBehavior) {
    validateScreenRecordingBehavior(
      action,
      action.parameters.ScreenRecordingBehavior as Record<string, unknown>,
    );
  }

  const requiredErrors = hasChatBehavior
    ? ["NoMatchingError", "ChannelMismatch", "InFlightRedactionConfigurationFailed"]
    : ["NoMatchingError", "ChannelMismatch"];
  requireErrorTypes(action, requiredErrors);
}

export function validateUpdateFlowLoggingBehaviorAction(action: FlowAction): void {
  const behavior = requireNonEmptyStringParameter(
    action,
    "FlowLoggingBehavior",
  ) as FlowLoggingBehavior;

  if (!FLOW_LOGGING_BEHAVIORS.has(behavior)) {
    throw new Error(
      `Action "${action.id}" of type "UpdateFlowLoggingBehavior" requires FlowLoggingBehavior to be Enabled or Disabled.`,
    );
  }
}

export function validateVoiceBehavior(action: FlowAction, voiceBehavior: Record<string, unknown>): void {
  if ("VoiceRecordingBehavior" in voiceBehavior) {
    const recordingBehavior = voiceBehavior.VoiceRecordingBehavior;
    if (!isObject(recordingBehavior)) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires VoiceRecordingBehavior to be an object.`,
      );
    }

    if (!Array.isArray(recordingBehavior.RecordedParticipants)) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires VoiceRecordingBehavior.RecordedParticipants to be an array.`,
      );
    }

    for (const participant of recordingBehavior.RecordedParticipants) {
      if (participant !== "Agent" && participant !== "Customer") {
        throw new Error(
          `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" only supports Agent and Customer in VoiceRecordingBehavior.RecordedParticipants.`,
        );
      }
    }

    if (
      "IVRRecordingBehavior" in recordingBehavior
      && recordingBehavior.IVRRecordingBehavior !== "Enabled"
      && recordingBehavior.IVRRecordingBehavior !== "Disabled"
    ) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires IVRRecordingBehavior to be Enabled or Disabled.`,
      );
    }
  }

  if ("VoiceAnalyticsBehavior" in voiceBehavior) {
    const analyticsBehavior = voiceBehavior.VoiceAnalyticsBehavior;
    if (!isObject(analyticsBehavior)) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires VoiceAnalyticsBehavior to be an object.`,
      );
    }

    if ("Enabled" in analyticsBehavior) {
      validateTrueFalseField(
        action,
        analyticsBehavior.Enabled,
        "VoiceBehavior.VoiceAnalyticsBehavior.Enabled",
      );
    }

    if ("AnalyticsModes" in analyticsBehavior) {
      if (!Array.isArray(analyticsBehavior.AnalyticsModes) || analyticsBehavior.AnalyticsModes.length === 0) {
        throw new Error(
          `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires VoiceAnalyticsBehavior.AnalyticsModes to be a non-empty array when provided.`,
        );
      }

      for (const mode of analyticsBehavior.AnalyticsModes) {
        if (!["RealTime", "PostContact", "AutomatedInteraction"].includes(String(mode))) {
          throw new Error(
            `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" uses unsupported voice analytics mode "${String(mode)}".`,
          );
        }
      }
    }

    if ("ConversationalAnalyticsRedactionConfiguration" in analyticsBehavior) {
      const redactionConfig = analyticsBehavior.ConversationalAnalyticsRedactionConfiguration;
      if (!isObject(redactionConfig)) {
        throw new Error(
          `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires ConversationalAnalyticsRedactionConfiguration to be an object when provided.`,
        );
      }

      validateTrueFalseField(
        action,
        redactionConfig.Enabled,
        "VoiceBehavior.VoiceAnalyticsBehavior.ConversationalAnalyticsRedactionConfiguration.Enabled",
      );
    }
  }
}

export function validateChatBehavior(action: FlowAction, chatBehavior: Record<string, unknown>): void {
  const analyticsBehavior = chatBehavior.ChatAnalyticsBehavior;
  if (!isObject(analyticsBehavior)) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires ChatAnalyticsBehavior to be an object.`,
    );
  }

  if ("Enabled" in analyticsBehavior) {
    validateTrueFalseField(
      action,
      analyticsBehavior.Enabled,
      "ChatBehavior.ChatAnalyticsBehavior.Enabled",
    );
  }

  if ("AnalyticsModes" in analyticsBehavior) {
    if (
      !Array.isArray(analyticsBehavior.AnalyticsModes)
      || analyticsBehavior.AnalyticsModes.length !== 1
      || analyticsBehavior.AnalyticsModes[0] !== "ContactLens"
    ) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" only supports ChatAnalyticsBehavior.AnalyticsModes of ["ContactLens"].`,
      );
    }
  }

  if ("InFlightChatRedactionConfiguration" in analyticsBehavior) {
    const redactionConfig = analyticsBehavior.InFlightChatRedactionConfiguration;
    if (!isObject(redactionConfig)) {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires InFlightChatRedactionConfiguration to be an object when provided.`,
      );
    }

    validateTrueFalseField(
      action,
      redactionConfig.Enabled,
      "ChatBehavior.ChatAnalyticsBehavior.InFlightChatRedactionConfiguration.Enabled",
    );

    if ("DeliverUnprocessedMessages" in redactionConfig) {
      validateTrueFalseField(
        action,
        redactionConfig.DeliverUnprocessedMessages,
        "ChatBehavior.ChatAnalyticsBehavior.InFlightChatRedactionConfiguration.DeliverUnprocessedMessages",
      );
    }
  }
}

export function validateScreenRecordingBehavior(action: FlowAction, screenRecordingBehavior: Record<string, unknown>): void {
  if (!Array.isArray(screenRecordingBehavior.ScreenRecordedParticipants)) {
    throw new Error(
      `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" requires ScreenRecordedParticipants to be an array.`,
    );
  }

  for (const participant of screenRecordingBehavior.ScreenRecordedParticipants) {
    if (participant !== "Agent") {
      throw new Error(
        `Action "${action.id}" of type "UpdateContactRecordingAndAnalyticsBehavior" only supports Agent in ScreenRecordedParticipants.`,
      );
    }
  }
}
