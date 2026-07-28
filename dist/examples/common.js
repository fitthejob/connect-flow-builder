import path from "node:path";
import { fileURLToPath } from "node:url";
export function printFlowWhenRunDirectly(metaUrl, flow) {
    const currentFilePath = fileURLToPath(metaUrl);
    const invokedPath = process.argv[1];
    if (!invokedPath) {
        return;
    }
    if (path.resolve(currentFilePath) === path.resolve(invokedPath)) {
        console.log(flow.toJsonString());
    }
}
