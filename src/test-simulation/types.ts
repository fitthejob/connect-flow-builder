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
  Transitions: {
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
  Usage: TestUsage;
  Actions: TestAction[];
  Transitions: TestTransitions;
}

export interface TestCaseDefinition {
  Version: "2019-10-30";
  Metadata: Record<string, never>;
  Observations: Observation[];
}
