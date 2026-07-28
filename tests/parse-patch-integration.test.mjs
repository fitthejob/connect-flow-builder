import assert from "node:assert/strict";
import test from "node:test";
import { UpdateContactRecordingAndAnalyticsBehaviorActionBuilder } from "../dist/index.js";
import { parseConnectFlowDefinition } from "../dist/parse/index.js";
import { readFileSync } from "node:fs";

test("Contact Lens injection changes only the injected block and rewired edges", () => {
  const original = JSON.parse(
    readFileSync("./generated-flows/check-routing.json", "utf8"));
  const flow = parseConnectFlowDefinition(original);

  const [target] = flow.findByType("TransferContactToQueue");
  const lens = new UpdateContactRecordingAndAnalyticsBehaviorActionBuilder("EnableContactLens")
    .voiceRecording(["Agent", "Customer"], "Enabled")
    .voiceAnalyticsBehavior({
      Enabled: "True",
      AnalyticsLanguage: "en-US",
      AnalyticsModes: ["RealTime", "AutomatedInteraction"],
      SentimentConfiguration: {
        Enabled: "True",
      },
    })
    .next(target.id)
    .onError(target.id, "NoMatchingError")
    .onError(target.id, "ChannelMismatch")
    .build();
  flow.insertBefore(target.id, lens);

  const emitted = flow.toConnectDefinition();
  const changedIds = [];
  for (const action of emitted.Actions) {
    const before = original.Actions.find((a) => a.Identifier === action.Identifier);
    if (!before) { changedIds.push(action.Identifier); continue; }
    if (JSON.stringify(before) !== JSON.stringify(action)) changedIds.push(action.Identifier);
  }
  // only the injected block plus the direct predecessors of the transfer changed
  assert.ok(changedIds.includes("EnableContactLens"));
  const preds = flow.predecessorsOf("EnableContactLens").map((p) => p.fromId);
  assert.deepEqual(changedIds.sort(),
    ["EnableContactLens", ...preds.filter((p) => p !== null)].sort());
});
