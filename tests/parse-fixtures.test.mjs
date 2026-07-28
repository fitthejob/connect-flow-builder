import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { parseConnectFlowDefinition } from "../dist/parse/index.js";

test("designer-quirk fixtures round-trip and diagnose correctly", () => {
  for (const file of readdirSync("./tests/fixtures/designer-quirks")) {
    const text = readFileSync(`./tests/fixtures/designer-quirks/${file}`, "utf8");
    const flow = parseConnectFlowDefinition(text);
    assert.equal(JSON.stringify(flow.toConnectDefinition()),
      JSON.stringify(JSON.parse(text)), file);
  }
  const flow = parseConnectFlowDefinition(
    readFileSync("./tests/fixtures/designer-quirks/unknown-blocks.json", "utf8"));
  assert.ok(flow.diagnostics.some((d) => d.code === "unknown-action"
    && d.actionType === "BrandNewDesignerBlock2030"));
});
