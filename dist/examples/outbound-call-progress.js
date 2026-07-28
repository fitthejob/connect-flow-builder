import { CheckOutboundCallStatusActionBuilder, DisconnectParticipantActionBuilder, FlowBuilder, MessageParticipantActionBuilder, } from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";
const checkProgress = new CheckOutboundCallStatusActionBuilder("CheckProgress")
    .whenCallAnswered("Answered")
    .whenVoicemailBeep("Voicemail")
    .whenVoicemailNoBeep("NoBeep")
    .whenNotDetected("Unknown")
    .onError("Disconnect")
    .build();
const answered = new MessageParticipantActionBuilder("Answered")
    .text("A live answer was detected.")
    .next("Disconnect")
    .build();
const voicemail = new MessageParticipantActionBuilder("Voicemail")
    .text("Voicemail beep detected.")
    .next("Disconnect")
    .build();
const noBeep = new MessageParticipantActionBuilder("NoBeep")
    .text("Voicemail without beep detected.")
    .next("Disconnect")
    .build();
const unknown = new MessageParticipantActionBuilder("Unknown")
    .text("The outbound call result could not be detected.")
    .next("Disconnect")
    .build();
const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();
export const flow = new FlowBuilder("OutboundCallProgress")
    .startWith(checkProgress)
    .add(answered)
    .add(voicemail)
    .add(noBeep)
    .add(unknown)
    .add(disconnect)
    .build();
printFlowWhenRunDirectly(import.meta.url, flow);
