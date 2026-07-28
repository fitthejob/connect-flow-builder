import {
  CheckHoursOfOperationActionBuilder,
  CheckMetricDataActionBuilder,
  CompareActionBuilder,
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  MessageParticipantActionBuilder,
  TransferContactToQueueActionBuilder,
  UpdateContactTargetQueueActionBuilder,
  equalsCondition,
  numberGreaterThanCondition,
} from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";

const checkHours = new CheckHoursOfOperationActionBuilder("CheckHours")
  .hoursOfOperationId("__HOURS_OF_OPERATION_ARN__")
  .whenInHours("CheckTier")
  .whenOutOfHours("ClosedMessage")
  .onError("Disconnect")
  .build();

const checkTier = new CompareActionBuilder("CheckTier")
  .comparisonValue("$.Attributes.customerTier")
  .when(equalsCondition("VIP"), "CheckQueueDepth")
  .when(equalsCondition("STANDARD"), "SetWorkingQueue")
  .onError("Disconnect")
  .build();

const checkQueueDepth = new CheckMetricDataActionBuilder("CheckQueueDepth")
  .numberOfContactsInQueue()
  .queueId("__QUEUE_ARN__")
  .when(numberGreaterThanCondition("10"), "OverflowMessage")
  .when(equalsCondition("0"), "SetWorkingQueue")
  .onError("SetWorkingQueue", "NoMatchingCondition")
  .build();

const closedMessage = new MessageParticipantActionBuilder("ClosedMessage")
  .text("We are currently closed.")
  .next("Disconnect")
  .build();

const overflowMessage = new MessageParticipantActionBuilder("OverflowMessage")
  .text("We are experiencing high contact volume.")
  .next("SetWorkingQueue")
  .build();

const setWorkingQueue = new UpdateContactTargetQueueActionBuilder(
  "SetWorkingQueue",
)
  .queueId("__QUEUE_ARN__")
  .next("TransferContactToQueue")
  .onError("Disconnect")
  .build();

const transferToQueue = new TransferContactToQueueActionBuilder(
  "TransferContactToQueue",
)
  .next("Disconnect")
  .onError("Disconnect", "QueueAtCapacity")
  .onError("Disconnect")
  .build();

const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

export const flow = new FlowBuilder("CheckRouting")
  .startWith(checkHours)
  .add(checkTier)
  .add(checkQueueDepth)
  .add(closedMessage)
  .add(overflowMessage)
  .add(setWorkingQueue)
  .add(transferToQueue)
  .add(disconnect)
  .build();

printFlowWhenRunDirectly(import.meta.url, flow);
