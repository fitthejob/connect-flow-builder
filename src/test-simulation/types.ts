export type TestEventType = "TestInitiated" | "MessageReceived";

export type TestActionType = "TestControl";

export type TestInitiatedEventProperties = Record<string, never>;

export interface MessageReceivedEventProperties {
  Text: string;
}

export type TestEvent =
  | {
      Type: "TestInitiated";
      Actor: "System";
      Properties: TestInitiatedEventProperties;
    }
  | {
      Type: "MessageReceived";
      Actor: "System";
      Properties: MessageReceivedEventProperties;
      MatchingCriteria: "Similarity";
    };

export interface TestControlCommand {
  Type: "EndTest";
}

export interface TestAction {
  Identifier: string;
  Type: TestActionType;
  Parameters: {
    ActionType: "TestControl";
    Command: TestControlCommand;
  };
  // Optional, not `{ NextAction: "" }` -- confirmed live against the real
  // CreateTestCase API (Status: PUBLISHED, which triggers content
  // validation): a terminal action's Transitions key must be entirely
  // absent. `{ NextAction: "" }` is rejected with
  // InvalidTestCaseException / InvalidActionProblem("Invalid next action
  // identifier: "), even though AWS's own devguide example
  // (testing-language-example.html) shows `"NextAction": ""` for the same
  // case -- that doc example does not match runtime validation as of
  // 2026-08-17.
  Transitions?: {
    NextAction: string;
  };
}

export interface TestTransitions {
  NextObservations: string[];
}

export interface TestUsage {
  Type: "EXACTLY";
}

export interface Observation {
  Identifier: string;
  Event: TestEvent;
  // Optional -- confirmed live against the real CreateTestCase API
  // (Status: PUBLISHED): supplying Usage at all on a TestInitiated-driven
  // observation is rejected with InvalidTestCaseException /
  // InvalidObservationProblem("Invalid usage type"), regardless of its
  // Type value ("EXACTLY" and "ANY" both tested, both rejected). AWS's own
  // devguide pages disagree with each other on this field's example value
  // (testing-language-example.html shows "EXACTLY",
  // testing-language-observations.html shows "ANY" in its own code
  // sample) -- neither is accepted when present; omitting the key
  // entirely is what the live API actually requires.
  Usage?: TestUsage;
  Actions: TestAction[];
  Transitions: TestTransitions;
}

export interface TestCaseDefinition {
  Version: "2019-10-30";
  Metadata: Record<string, never>;
  Observations: Observation[];
}
