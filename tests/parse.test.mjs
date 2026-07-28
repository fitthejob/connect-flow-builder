import assert from "node:assert/strict";
import test from "node:test";
import {
  isPassthroughAction,
  FlowParseError,
  parseConnectFlowDefinition,
} from "../dist/parse/index.js";
import { MessageParticipantActionBuilder } from "../dist/index.js";

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

const QUIRKY_FLOW = {
  Version: "2030-01-01",           // unknown version
  StartAction: "u1",
  Actions: [
    { Identifier: "u1", Type: "SomeFutureBlock",
      Parameters: { Anything: true }, Transitions: { NextAction: "m1" } },
    { Identifier: "m1", Type: "TransferToFlow",
      Parameters: {},                // missing required ContactFlowId -> nonconforming
      Transitions: { NextAction: "gone" } },  // dangling
  ],
};

test("unknown action types become passthrough with a diagnostic", () => {
  const flow = parseConnectFlowDefinition(QUIRKY_FLOW);
  const u1 = flow.getAction("u1");
  assert.equal(isPassthroughAction(u1), true);
  assert.equal(u1.type, "SomeFutureBlock");
  assert.deepEqual(u1.raw.Parameters, { Anything: true });
  assert.ok(flow.diagnostics.some(
    (d) => d.code === "unknown-action" && d.actionId === "u1"));
});

test("nonconforming known actions parse with a diagnostic", () => {
  const flow = parseConnectFlowDefinition(QUIRKY_FLOW);
  assert.equal(isPassthroughAction(flow.getAction("m1")), false);
  const d = flow.diagnostics.find((d) => d.code === "nonconforming");
  assert.equal(d.actionId, "m1");
  assert.match(d.message, /ContactFlowId/);
});

test("dangling transitions produce a diagnostic, not a throw", () => {
  const flow = parseConnectFlowDefinition(QUIRKY_FLOW);
  assert.ok(flow.diagnostics.some(
    (d) => d.code === "dangling-transition" && d.actionId === "m1"));
});

test("unknown Version produces a document-level diagnostic", () => {
  const flow = parseConnectFlowDefinition(QUIRKY_FLOW);
  assert.ok(flow.diagnostics.some(
    (d) => d.code === "unknown-version" && d.actionId === null));
});

const BRANCHY_FLOW = {
  Version: "2019-10-30",
  StartAction: "input",
  Actions: [
    { Identifier: "input", Type: "GetParticipantInput",
      Parameters: { InputTimeLimitSeconds: "5" },
      Transitions: {
        NextAction: "queue",
        Conditions: [{ NextAction: "queue",
          Condition: { Operator: "Equals", Operands: ["1"] } }],
        Errors: [{ NextAction: "end", ErrorType: "NoMatchingCondition" }],
      } },
    { Identifier: "mystery", Type: "FutureBlock", Parameters: {},
      Transitions: { NextAction: "queue" } },
    { Identifier: "queue", Type: "TransferContactToQueue", Parameters: {},
      Transitions: { Errors: [
        { NextAction: "end", ErrorType: "QueueAtCapacity" },
        { NextAction: "end", ErrorType: "NoMatchingError" } ] } },
    { Identifier: "end", Type: "DisconnectParticipant", Parameters: {} },
  ],
};

test("findByType returns matching actions", () => {
  const flow = parseConnectFlowDefinition(BRANCHY_FLOW);
  assert.deepEqual(flow.findByType("TransferContactToQueue").map((a) => a.id), ["queue"]);
  assert.deepEqual(flow.findByType("FutureBlock").map((a) => a.id), ["mystery"]);
});

test("predecessorsOf reports every incoming edge including from passthrough", () => {
  const flow = parseConnectFlowDefinition(BRANCHY_FLOW);
  const preds = flow.predecessorsOf("queue");
  assert.deepEqual(
    preds.map((p) => [p.fromId, p.edge.kind]).sort(),
    [["input", "condition"], ["input", "next"], ["mystery", "next"]],
  );
});

test("predecessorsOf includes the document start pointer", () => {
  const flow = parseConnectFlowDefinition(BRANCHY_FLOW);
  assert.deepEqual(flow.predecessorsOf("input"),
    [{ fromId: null, edge: { kind: "start" } }]);
});

test("unmodified flows re-emit byte-identically (modulo whitespace)", () => {
  const original = structuredClone(BRANCHY_FLOW);
  const flow = parseConnectFlowDefinition(original);
  assert.equal(
    JSON.stringify(flow.toConnectDefinition()),
    JSON.stringify(original),
  );
});

test("unrecognized top-level keys round-trip verbatim", () => {
  const withExtras = { ...structuredClone(SIMPLE_FLOW),
    Settings: { InputParameters: [], OutputParameters: [], Transitions: [] },
    FutureTopLevelKey: { anything: [1, 2, 3] } };
  const flow = parseConnectFlowDefinition(withExtras);
  assert.equal(
    JSON.stringify(flow.toConnectDefinition()),
    JSON.stringify(withExtras),
  );
});

test("every generated example flow round-trips", async () => {
  const { readdirSync, readFileSync } = await import("node:fs");
  for (const file of readdirSync("./generated-flows")) {
    if (!file.endsWith(".json")) continue;
    const original = JSON.parse(readFileSync(`./generated-flows/${file}`, "utf8"));
    const flow = parseConnectFlowDefinition(original);
    assert.equal(JSON.stringify(flow.toConnectDefinition()),
      JSON.stringify(original), file);
  }
});

function lens() {
  return new MessageParticipantActionBuilder("Injected")
    .text("placeholder-block").build();
}

test("addAction throws on id collision", () => {
  const flow = parseConnectFlowDefinition(structuredClone(BRANCHY_FLOW));
  assert.throws(() => flow.addAction({ id: "queue",
    type: "MessageParticipant", parameters: { Text: "x" } }), /already exists/);
});

test("insertBefore rewires every predecessor including passthrough and self-edges", () => {
  const flow = parseConnectFlowDefinition(structuredClone(BRANCHY_FLOW));
  flow.insertBefore("queue", lens());
  const emitted = flow.toConnectDefinition();
  const byId = Object.fromEntries(emitted.Actions.map((a) => [a.Identifier, a]));
  assert.equal(byId.input.Transitions.NextAction, "Injected");
  assert.equal(byId.input.Transitions.Conditions[0].NextAction, "Injected");
  assert.equal(byId.mystery.Transitions.NextAction, "Injected"); // passthrough rewired
  assert.equal(byId.Injected.Transitions.NextAction, "queue");
});

test("insertBefore at the start action retargets StartAction", () => {
  const flow = parseConnectFlowDefinition(structuredClone(BRANCHY_FLOW));
  flow.insertBefore("input", lens());
  assert.equal(flow.toConnectDefinition().StartAction, "Injected");
});

test("passthrough parameters are never modified by rewiring", () => {
  const flow = parseConnectFlowDefinition(structuredClone(BRANCHY_FLOW));
  flow.insertBefore("queue", lens());
  const mystery = flow.toConnectDefinition().Actions
    .find((a) => a.Identifier === "mystery");
  assert.deepEqual(mystery.Parameters, {});
  assert.equal(mystery.Type, "FutureBlock");
});
