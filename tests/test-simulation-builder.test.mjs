import assert from "node:assert/strict";
import test from "node:test";

import { TestInitiatedEventBuilder } from "../dist/actions-test-sim/events/test-initiated.js";
import { MessageReceivedEventBuilder } from "../dist/actions-test-sim/events/message-received.js";
import { EndTestActionBuilder } from "../dist/actions-test-sim/actions/test-control.js";
import { TestCaseBuilder } from "../dist/test-simulation/test-case-builder.js";

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
