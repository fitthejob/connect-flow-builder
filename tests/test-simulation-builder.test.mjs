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

test("EndTestActionBuilder builds a TestControl EndTest action", () => {
  const action = new EndTestActionBuilder("EndTest").build();
  assert.deepEqual(action, {
    Identifier: "EndTest",
    Type: "TestControl",
    Parameters: {
      ActionType: "TestControl",
      Command: { Type: "EndTest" },
    },
    Transitions: { NextAction: "" },
  });
});

test("TestCaseBuilder assembles Observations in insertion order and serializes correctly", () => {
  const welcomeEvent = new MessageReceivedEventBuilder(
    "Press 1 to be connected to an agent",
  ).build();
  const endTestAction = new EndTestActionBuilder("EndTest").build();

  const builtTestCase = new TestCaseBuilder()
    .add({
      Identifier: "TriggerHoursCheck",
      Event: new TestInitiatedEventBuilder().build(),
      Usage: { Type: "EXACTLY" },
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
        Usage: { Type: "EXACTLY" },
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
            Transitions: { NextAction: "" },
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
      Identifier: "Only",
      Event: new TestInitiatedEventBuilder().build(),
      Usage: { Type: "EXACTLY" },
      Actions: [],
      Transitions: { NextObservations: [] },
    })
    .build();

  const compact = builtTestCase.toJsonString(false);
  assert.equal(compact.includes("\n"), false);
  assert.deepEqual(JSON.parse(compact), builtTestCase.definition);
});

test("builder output structurally matches the AWS docs Observations schema shape", () => {
  const builtTestCase = new TestCaseBuilder()
    .add({
      Identifier: "TestStart",
      Event: new TestInitiatedEventBuilder().build(),
      Usage: { Type: "EXACTLY" },
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

  // Top-level shape matches the AWS docs example's envelope exactly.
  assert.equal(parsed.Version, "2019-10-30");
  assert.deepEqual(parsed.Metadata, {});
  assert.equal(Array.isArray(parsed.Observations), true);
  assert.equal(parsed.Observations.length, 2);

  // Each observation has exactly the five top-level keys the AWS example's
  // observations have: Identifier, Event, Usage, Actions, Transitions.
  for (const observation of parsed.Observations) {
    assert.deepEqual(
      Object.keys(observation).sort(),
      ["Actions", "Event", "Identifier", "Transitions", "Usage"],
    );
  }

  // First observation's Event shape matches the AWS example's
  // TriggerHoursCheck.Event shape (Type/Actor/Properties, no MatchingCriteria).
  const [first, second] = parsed.Observations;
  assert.deepEqual(Object.keys(first.Event).sort(), ["Actor", "Properties", "Type"]);
  assert.equal(first.Event.Type, "TestInitiated");

  // Second observation's Event shape matches the AWS example's
  // WelcomeMessage.Event shape (adds MatchingCriteria).
  assert.deepEqual(
    Object.keys(second.Event).sort(),
    ["Actor", "MatchingCriteria", "Properties", "Type"],
  );
  assert.equal(second.Event.Type, "MessageReceived");
  assert.equal(second.Event.MatchingCriteria, "Similarity");

  // Terminal action shape matches the AWS example's EndTest action shape.
  const endTestAction = second.Actions[0];
  assert.deepEqual(endTestAction.Parameters, {
    ActionType: "TestControl",
    Command: { Type: "EndTest" },
  });
});
