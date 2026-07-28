import {
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  GetParticipantInputActionBuilder,
  MessageParticipantActionBuilder,
  equalsCondition,
  textStartsWithCondition,
} from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";

const playGreeting = new MessageParticipantActionBuilder("PlayGreeting")
  .text("Welcome to the branching demo. Say sales or billing.")
  .next("GetDepartment")
  .onError("Disconnect")
  .build();

const getDepartment = new GetParticipantInputActionBuilder("GetDepartment")
  .text("Please say sales or billing.")
  .lexBotAliasArn("__LEX_BOT_ALIAS_ARN__")
  .when(equalsCondition("sales"), "RouteSales")
  .when(textStartsWithCondition("bill"), "RouteBilling")
  .next("Fallback")
  .onError("Disconnect")
  .build();

const routeSales = new MessageParticipantActionBuilder("RouteSales")
  .text("Routing to sales.")
  .next("Disconnect")
  .build();

const routeBilling = new MessageParticipantActionBuilder("RouteBilling")
  .text("Routing to billing.")
  .next("Disconnect")
  .build();

const fallback = new MessageParticipantActionBuilder("Fallback")
  .text("We could not determine the department.")
  .next("Disconnect")
  .build();

const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

export const flow = new FlowBuilder("BranchingOnInput")
  .startWith(playGreeting)
  .add(getDepartment)
  .add(routeSales)
  .add(routeBilling)
  .add(fallback)
  .add(disconnect)
  .build();

printFlowWhenRunDirectly(import.meta.url, flow);
