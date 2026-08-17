import assert from "node:assert/strict";
import test from "node:test";

import { TestInitiatedEventBuilder } from "../dist/actions-test-sim/events/test-initiated.js";
import { MessageReceivedEventBuilder } from "../dist/actions-test-sim/events/message-received.js";
import { EndTestActionBuilder } from "../dist/actions-test-sim/actions/test-control.js";

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
