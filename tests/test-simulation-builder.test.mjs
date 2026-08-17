import assert from "node:assert/strict";
import test from "node:test";

import {
  TestInitiatedEventBuilder,
  MessageReceivedEventBuilder,
  EndTestActionBuilder,
  TestCaseBuilder,
} from "../dist/index.js";

test("TestInitiatedEventBuilder builds a TestInitiated event with empty properties", () => {
  const event = new TestInitiatedEventBuilder().build();
  assert.deepEqual(event, {
    Type: "TestInitiated",
    Actor: "System",
    Properties: {},
  });
});

test("MessageReceivedEventBuilder builds a MessageReceived event with the given text", () => {
  const event = new MessageReceivedEventBuilder("Press 1 to be connected to an agent").build();
  assert.deepEqual(event, {
    Type: "MessageReceived",
    Actor: "System",
    Properties: { Text: "Press 1 to be connected to an agent" },
    MatchingCriteria: "Similarity",
  });
});

test("EndTestActionBuilder builds a TestControl EndTest action with no Transitions key", () => {
  // No Transitions key -- confirmed live against the real CreateTestCase
  // API (Status: PUBLISHED) 2026-08-17: an explicit
  // `Transitions: { NextAction: "" }` is rejected with
  // InvalidActionProblem("Invalid next action identifier: "), even though
  // AWS's own devguide example shows that exact shape. Omitting the key
  // is what the live API actually accepts for a terminal action.
  const action = new EndTestActionBuilder("EndTest").build();
  assert.deepEqual(action, {
    Identifier: "EndTest",
    Type: "TestControl",
    Parameters: {
      ActionType: "TestControl",
      Command: { Type: "EndTest" },
    },
  });
  assert.equal("Transitions" in action, false);
});

test("TestCaseBuilder assembles Observations in insertion order and serializes correctly", () => {
  const welcomeEvent = new MessageReceivedEventBuilder(
    "Press 1 to be connected to an agent",
  ).build();
  const endTestAction = new EndTestActionBuilder("EndTest").build();

  const builtTestCase = new TestCaseBuilder()
    .add({
      // No Usage key -- confirmed live 2026-08-17 that CreateTestCase
      // (Status: PUBLISHED) rejects Usage being present at all on a
      // TestInitiated-driven observation (InvalidObservationProblem,
      // "Invalid usage type" -- tried both "EXACTLY" and "ANY", both
      // rejected). MessageReceived observations were not live-tested
      // either way, so WelcomeMessage below keeps Usage unchanged.
      Identifier: "TriggerHoursCheck",
      Event: new TestInitiatedEventBuilder().build(),
      Actions: [],
      Transitions: { NextObservations: ["WelcomeMessage"] },
    })
    .add({
      Identifier: "WelcomeMessage",
      Event: welcomeEvent,
      Usage: { Type: "EXACTLY" },
      Actions: [endTestAction],
      Transitions: { NextObservations: [] },
    })
    .build();

  assert.deepEqual(builtTestCase.definition, {
    Version: "2019-10-30",
    Metadata: {},
    Observations: [
      {
        Identifier: "TriggerHoursCheck",
        Event: { Type: "TestInitiated", Actor: "System", Properties: {} },
        Actions: [],
        Transitions: { NextObservations: ["WelcomeMessage"] },
      },
      {
        Identifier: "WelcomeMessage",
        Event: {
          Type: "MessageReceived",
          Actor: "System",
          Properties: { Text: "Press 1 to be connected to an agent" },
          MatchingCriteria: "Similarity",
        },
        Usage: { Type: "EXACTLY" },
        Actions: [
          {
            Identifier: "EndTest",
            Type: "TestControl",
            Parameters: {
              ActionType: "TestControl",
              Command: { Type: "EndTest" },
            },
          },
        ],
        Transitions: { NextObservations: [] },
      },
    ],
  });

  const json = JSON.parse(builtTestCase.toJsonString());
  assert.deepEqual(json, builtTestCase.definition);
});

test("BuiltTestCase.toJsonString(false) produces compact JSON with no added whitespace", () => {
  const builtTestCase = new TestCaseBuilder()
    .add({
      // No Usage key -- see the TestInitiated rationale above.
      Identifier: "Only",
      Event: new TestInitiatedEventBuilder().build(),
      Actions: [],
      Transitions: { NextObservations: [] },
    })
    .build();

  const compact = builtTestCase.toJsonString(false);
  assert.equal(compact.includes("\n"), false);
  assert.deepEqual(JSON.parse(compact), builtTestCase.definition);
});

test("builder output structurally matches the live-verified CreateTestCase schema shape", () => {
  // Asserts against real API behavior confirmed live 2026-08-17
  // (CreateTestCase, Status: PUBLISHED against a real Amazon Connect
  // instance), not AWS's devguide example -- that example's own JSON
  // (testing-language-example.html) does not pass live validation as
  // written (Usage present on a TestInitiated observation, and
  // Transitions: { NextAction: "" } on a terminal action, are both
  // rejected by the real service).
  const builtTestCase = new TestCaseBuilder()
    .add({
      Identifier: "TestStart",
      Event: new TestInitiatedEventBuilder().build(),
      Actions: [],
      Transitions: { NextObservations: ["WelcomeMessage"] },
    })
    .add({
      Identifier: "WelcomeMessage",
      Event: new MessageReceivedEventBuilder(
        "Press 1 to be connected to an agent",
      ).build(),
      Usage: { Type: "EXACTLY" },
      Actions: [new EndTestActionBuilder("EndTest").build()],
      Transitions: { NextObservations: [] },
    })
    .build();

  const parsed = JSON.parse(builtTestCase.toJsonString());

  assert.equal(parsed.Version, "2019-10-30");
  assert.deepEqual(parsed.Metadata, {});
  assert.equal(Array.isArray(parsed.Observations), true);
  assert.equal(parsed.Observations.length, 2);

  const [first, second] = parsed.Observations;

  // TestInitiated-driven observation: no Usage key.
  assert.deepEqual(
    Object.keys(first).sort(),
    ["Actions", "Event", "Identifier", "Transitions"],
  );
  assert.deepEqual(Object.keys(first.Event).sort(), ["Actor", "Properties", "Type"]);
  assert.equal(first.Event.Type, "TestInitiated");

  // MessageReceived-driven observation: Usage present (unverified either
  // way against the live API, kept as this package's existing default).
  assert.deepEqual(
    Object.keys(second).sort(),
    ["Actions", "Event", "Identifier", "Transitions", "Usage"],
  );
  assert.deepEqual(
    Object.keys(second.Event).sort(),
    ["Actor", "MatchingCriteria", "Properties", "Type"],
  );
  assert.equal(second.Event.Type, "MessageReceived");
  assert.equal(second.Event.MatchingCriteria, "Similarity");

  // Terminal EndTest action: Parameters shape unchanged, but no
  // Transitions key (confirmed live -- see EndTestActionBuilder test above).
  const endTestAction = second.Actions[0];
  assert.deepEqual(endTestAction.Parameters, {
    ActionType: "TestControl",
    Command: { Type: "EndTest" },
  });
  assert.equal("Transitions" in endTestAction, false);
});
