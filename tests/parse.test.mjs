import assert from "node:assert/strict";
import test from "node:test";
import {
  isPassthroughAction,
  FlowParseError,
  parseConnectFlowDefinition,
} from "../dist/parse/index.js";

test("isPassthroughAction discriminates ParsedAction variants", () => {
  assert.equal(
    isPassthroughAction({ id: "X", type: "SomeNewThing", raw: {}, passthrough: true }),
    true,
  );
  assert.equal(
    isPassthroughAction({ id: "X", type: "MessageParticipant", parameters: {} }),
    false,
  );
});

test("FlowParseError is an Error subclass", () => {
  assert.ok(new FlowParseError("bad") instanceof Error);
});

const SIMPLE_FLOW = {
  Version: "2019-10-30",
  StartAction: "a1",
  Metadata: { entryPointPosition: { x: 40, y: 40 } },
  Actions: [
    { Identifier: "a1", Type: "MessageParticipant",
      Parameters: { Text: "hi" }, Transitions: { NextAction: "a2" } },
    { Identifier: "a2", Type: "DisconnectParticipant", Parameters: {} },
  ],
};

test("parses a simple flow into typed actions", () => {
  const flow = parseConnectFlowDefinition(SIMPLE_FLOW);
  assert.equal(flow.startActionId, "a1");
  assert.equal(flow.actions.length, 2);
  const a1 = flow.getAction("a1");
  assert.equal(a1.type, "MessageParticipant");
  assert.equal(a1.parameters.Text, "hi");
  assert.equal(a1.transitions.nextAction, "a2");
  assert.equal(flow.diagnostics.length, 0);
});

test("accepts a JSON string", () => {
  const flow = parseConnectFlowDefinition(JSON.stringify(SIMPLE_FLOW));
  assert.equal(flow.startActionId, "a1");
});

test("throws FlowParseError on invalid JSON string", () => {
  assert.throws(() => parseConnectFlowDefinition("{nope"), FlowParseError);
});

test("throws FlowParseError on missing StartAction / Actions / Version", () => {
  for (const key of ["Version", "StartAction", "Actions"]) {
    const bad = structuredClone(SIMPLE_FLOW);
    delete bad[key];
    assert.throws(() => parseConnectFlowDefinition(bad), FlowParseError);
  }
});

test("throws FlowParseError on duplicate Identifiers", () => {
  const bad = structuredClone(SIMPLE_FLOW);
  bad.Actions.push({ Identifier: "a1", Type: "DisconnectParticipant", Parameters: {} });
  assert.throws(() => parseConnectFlowDefinition(bad), FlowParseError);
});

test("deep-copies object input (caller isolation)", () => {
  const input = structuredClone(SIMPLE_FLOW);
  const flow = parseConnectFlowDefinition(input);
  input.Actions[0].Parameters.Text = "MUTATED";
  assert.equal(flow.getAction("a1").parameters.Text, "hi");
});
