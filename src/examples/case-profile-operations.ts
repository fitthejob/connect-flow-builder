import {
  CreateCaseActionBuilder,
  CreateCustomerProfileActionBuilder,
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  GetCaseActionBuilder,
  GetCustomerProfileActionBuilder,
  GetCustomerProfileObjectActionBuilder,
  MessageParticipantActionBuilder,
  UpdateCaseActionBuilder,
  UpdateCustomerProfileActionBuilder,
} from "../index.js";
import { printFlowWhenRunDirectly } from "./common.js";

const greeting = new MessageParticipantActionBuilder("Greeting")
  .text("We are preparing your customer profile and case context.")
  .next("GetProfile")
  .onError("Disconnect")
  .build();

const getProfile = new GetCustomerProfileActionBuilder("GetProfile")
  .identifier("CustomerId", "$.Attributes.customerId")
  .responseField("ProfileId")
  .responseField("FirstName")
  .responseField("LastName")
  .next("GetProfileObject")
  .onError("Disconnect", "MultipleFoundError")
  .onError("Disconnect", "NoneFoundError")
  .onError("Disconnect", "NoMatchingError")
  .build();

const getProfileObject = new GetCustomerProfileObjectActionBuilder("GetProfileObject")
  .profileId("$.External.ProfileId")
  .objectType("Customer")
  .useLatest()
  .responseField("ObjectId")
  .next("CreateProfile")
  .onError("Disconnect", "NoneFoundError")
  .onError("Disconnect", "NoMatchingError")
  .build();

const createProfile = new CreateCustomerProfileActionBuilder("CreateProfile")
  .requestField("FirstName", "$.Attributes.firstName")
  .requestField("LastName", "$.Attributes.lastName")
  .requestField("PhoneNumber", "$.CustomerEndpoint.Address")
  .responseField("ProfileId")
  .next("CreateCase")
  .onError("Disconnect")
  .build();

const createCase = new CreateCaseActionBuilder("CreateCase")
  .caseTemplateId("__CASE_TEMPLATE_ID__")
  .caseField("customerId", "$.Attributes.customerId")
  .caseField("summary", "Customer profile review")
  .next("GetCase")
  .onError("Disconnect")
  .build();

const getCase = new GetCaseActionBuilder("GetCase")
  .customerId("$.Attributes.customerId")
  .getLastUpdatedCase()
  .caseResponseField("caseId")
  .caseResponseField("status")
  .next("UpdateCase")
  .onError("Disconnect", "NoMatchingError")
  .onError("Disconnect", "ContactNotLinked")
  .onError("Disconnect", "MultipleFound")
  .onError("Disconnect", "NoneFound")
  .build();

const updateCase = new UpdateCaseActionBuilder("UpdateCase")
  .caseId("$.External.caseId")
  .caseField("status", "in_progress")
  .caseField("owner", "voice-ops")
  .next("UpdateProfile")
  .onError("Disconnect", "ContactNotLinked")
  .onError("Disconnect", "NoMatchingError")
  .build();

const updateProfile = new UpdateCustomerProfileActionBuilder("UpdateProfile")
  .requestField("ProfileId", "$.External.ProfileId")
  .requestField("PreferredChannel", "voice")
  .responseField("ProfileId")
  .next("Disconnect")
  .onError("Disconnect")
  .build();

const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

export const flow = new FlowBuilder("CaseProfileOperations")
  .startWith(greeting)
  .add(getProfile)
  .add(getProfileObject)
  .add(createProfile)
  .add(createCase)
  .add(getCase)
  .add(updateCase)
  .add(updateProfile)
  .add(disconnect)
  .build();

printFlowWhenRunDirectly(import.meta.url, flow);
