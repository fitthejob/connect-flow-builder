import path from "node:path";
import { fileURLToPath } from "node:url";

import type { BuiltFlow } from "../core/flow-builder.js";

export interface GeneratedExampleFlow {
  filename: string;
  flow: BuiltFlow;
}

export function printFlowWhenRunDirectly(metaUrl: string, flow: BuiltFlow): void {
  const currentFilePath = fileURLToPath(metaUrl);
  const invokedPath = process.argv[1];

  if (!invokedPath) {
    return;
  }

  if (path.resolve(currentFilePath) === path.resolve(invokedPath)) {
    console.log(flow.toJsonString());
  }
}
