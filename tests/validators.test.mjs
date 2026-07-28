import assert from "node:assert/strict";
import test from "node:test";
import { validateSingleAction } from "../dist/index.js";

test("validateSingleAction throws on a missing required parameter", () => {
  assert.throws(
    () => validateSingleAction({
      id: "Wisdom",
      type: "CreateWisdomSession",
      parameters: {},
    }),
    /requires parameter "WisdomAssistantArn"/,
  );
});

test("validateSingleAction accepts a conforming action", () => {
  validateSingleAction({
    id: "Msg",
    type: "MessageParticipant",
    parameters: { Text: "hello" },
    transitions: { nextAction: "Next" },
  });
});

test("validateSingleAction skips cross-action transition checks", () => {
  // nextAction "Nowhere" does not exist; that is the whole-flow validator's job
  validateSingleAction({
    id: "Msg",
    type: "MessageParticipant",
    parameters: { Text: "hello" },
    transitions: { nextAction: "Nowhere" },
  });
});
