import { DisconnectParticipantActionBuilder, FlowBuilder, MessageParticipantActionBuilder, ShowViewActionBuilder, TransferToFlowActionBuilder, UpdateRoutingCriteriaActionBuilder, WaitActionBuilder, equalsCondition, } from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";
const setRoutingCriteria = new UpdateRoutingCriteriaActionBuilder("SetRoutingCriteria")
    .staticRoutingCriteria()
    .addAttributeConditionStep({
    Name: "Skill.Chat",
    Value: "4",
    ProficiencyLevel: 4,
    ComparisonOperator: "NumberGreaterOrEqualTo",
}, 45)
    .next("ShowGuide")
    .onError("Disconnect")
    .build();
const showGuide = new ShowViewActionBuilder("ShowGuide")
    .viewResource("__VIEW_ID__", "1")
    .invocationTimeLimitSeconds(400)
    .viewData("customerTier", "$.Attributes.customerTier")
    .hideResponseOnTranscript()
    .when(equalsCondition("Continue"), "WaitForReturn")
    .when(equalsCondition("Escalate"), "TransferToOverflowFlow")
    .onError("Disconnect")
    .build();
const waitForReturn = new WaitActionBuilder("WaitForReturn")
    .timeoutSeconds(60)
    .events("CustomerReturned")
    .onWaitCompleted("TimeoutMessage")
    .onEvent("CustomerReturned", "TransferToOverflowFlow")
    .onError("Disconnect")
    .build();
const timeoutMessage = new MessageParticipantActionBuilder("TimeoutMessage")
    .text("We did not receive a response in time.")
    .next("Disconnect")
    .build();
const transferToOverflowFlow = new TransferToFlowActionBuilder("TransferToOverflowFlow")
    .contactFlowId("__OVERFLOW_FLOW_ARN__")
    .onError("Disconnect")
    .build();
const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();
export const flow = new FlowBuilder("GuidedWaitTransfer")
    .startWith(setRoutingCriteria)
    .add(showGuide)
    .add(waitForReturn)
    .add(timeoutMessage)
    .add(transferToOverflowFlow)
    .add(disconnect)
    .build();
printFlowWhenRunDirectly(import.meta.url, flow);
