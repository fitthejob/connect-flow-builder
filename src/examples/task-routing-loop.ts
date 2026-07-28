import {
  CreateTaskActionBuilder,
  DisconnectParticipantActionBuilder,
  DistributeByPercentageActionBuilder,
  FlowBuilder,
  LoopActionBuilder,
  MessageParticipantActionBuilder,
} from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";

const distribute = new DistributeByPercentageActionBuilder("Distribute")
  .addDistribution(60, "ImmediateTask")
  .addDistribution(30, "ScheduledTask")
  .onError("Disconnect")
  .build();

const immediateTask = new CreateTaskActionBuilder("ImmediateTask")
  .contactFlowId("__TASK_FLOW_ARN__")
  .name("Immediate support task")
  .attribute("queue", "primary")
  .next("RetryLoop")
  .onError("Disconnect")
  .build();

const scheduledTask = new CreateTaskActionBuilder("ScheduledTask")
  .contactFlowId("__TASK_FLOW_ARN__")
  .name("Scheduled support task")
  .delaySeconds(300)
  .reference("ticketId", "$.Attributes.ticketId")
  .next("RetryLoop")
  .onError("Disconnect")
  .build();

const retryLoop = new LoopActionBuilder("RetryLoop")
  .loopCount(2)
  .whenContinueLooping("FollowupTask")
  .whenDoneLooping("DoneMessage")
  .build();

const followupTask = new CreateTaskActionBuilder("FollowupTask")
  .contactFlowId("__TASK_FLOW_ARN__")
  .name("Follow-up support task")
  .description("Created from the retry loop example.")
  .next("RetryLoop")
  .onError("Disconnect")
  .build();

const doneMessage = new MessageParticipantActionBuilder("DoneMessage")
  .text("Task routing is complete.")
  .next("Disconnect")
  .build();

const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

export const flow = new FlowBuilder("TaskRoutingLoop")
  .startWith(distribute)
  .add(immediateTask)
  .add(scheduledTask)
  .add(retryLoop)
  .add(followupTask)
  .add(doneMessage)
  .add(disconnect)
  .build();

printFlowWhenRunDirectly(import.meta.url, flow);
