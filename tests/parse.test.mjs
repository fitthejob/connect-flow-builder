import assert from "node:assert/strict";
import test from "node:test";
import { isPassthroughAction, FlowParseError } from "../dist/parse/index.js";

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
