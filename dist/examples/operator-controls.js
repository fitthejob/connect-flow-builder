import { EndFlowExecutionActionBuilder, FlowBuilder, InvokeFlowModuleActionBuilder, MessageParticipantActionBuilder, TagContactActionBuilder, UnTagContactActionBuilder, UpdateContactCallbackNumberActionBuilder, UpdateContactTextToSpeechVoiceActionBuilder, UpdateFlowLoggingBehaviorActionBuilder, } from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";
const greeting = new MessageParticipantActionBuilder("Greeting")
    .text("We are preparing your callback and operator context.")
    .next("TagContact")
    .build();
const tagContact = new TagContactActionBuilder("TagContact")
    .tag("journeyStage", "callback")
    .tag("operatorProfile", "junior-dev")
    .next("SetVoice")
    .build();
const setVoice = new UpdateContactTextToSpeechVoiceActionBuilder("SetVoice")
    .voice("Joanna")
    .engine("Neural")
    .style("None")
    .next("SetLogging")
    .onError("EndFlow")
    .build();
const setLogging = new UpdateFlowLoggingBehaviorActionBuilder("SetLogging")
    .enabled()
    .next("InvokeModule")
    .build();
const invokeModule = new InvokeFlowModuleActionBuilder("InvokeModule")
    .flowModuleId("__COMMON_CALLBACK_PREP_MODULE_ARN__")
    .next("SetCallbackNumber")
    .onError("EndFlow")
    .build();
const setCallbackNumber = new UpdateContactCallbackNumberActionBuilder("SetCallbackNumber")
    .callbackNumberJsonPath("$.Attributes.callbackNumber")
    .next("CleanupTags")
    .onError("EndFlow", "InvalidCallbackNumber")
    .onError("EndFlow", "CallbackNumberNotDialable")
    .build();
const cleanupTags = new UnTagContactActionBuilder("CleanupTags")
    .keys("journeyStage", "operatorProfile")
    .next("EndFlow")
    .onError("EndFlow")
    .build();
const endFlow = new EndFlowExecutionActionBuilder("EndFlow").build();
export const flow = new FlowBuilder("OperatorControls")
    .startWith(greeting)
    .add(tagContact)
    .add(setVoice)
    .add(setLogging)
    .add(invokeModule)
    .add(setCallbackNumber)
    .add(cleanupTags)
    .add(endFlow)
    .build();
printFlowWhenRunDirectly(import.meta.url, flow);
