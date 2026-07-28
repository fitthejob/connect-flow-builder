import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedExampleFlows } from "./examples/index.js";
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDir, "..");
const outputDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(repositoryRoot, "generated-flows");
fs.mkdirSync(outputDir, { recursive: true });
for (const generatedFlow of generatedExampleFlows) {
    fs.writeFileSync(path.join(outputDir, generatedFlow.filename), `${generatedFlow.flow.toJsonString()}\n`, "utf8");
}
console.log(`Generated ${generatedExampleFlows.length} flow files in ${outputDir}`);
