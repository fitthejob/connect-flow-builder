import assert from "node:assert/strict";
import test from "node:test";

import {
  testActionDefinitions,
  testActionRegistry,
  getTestActionDefinition,
} from "../dist/test-simulation/registry.js";

test("test-simulation registry has exactly one action type: TestControl", () => {
  assert.deepEqual(
    testActionDefinitions.map((d) => d.type),
    ["TestControl"],
  );
});

test("testActionRegistry keys match testActionDefinitions types", () => {
  assert.deepEqual(
    Object.keys(testActionRegistry).sort(),
    testActionDefinitions.map((d) => d.type).sort(),
  );
});

test("getTestActionDefinition returns the matching definition", () => {
  const definition = getTestActionDefinition("TestControl");
  assert.equal(definition.type, "TestControl");
  assert.equal(typeof definition.description, "string");
});
