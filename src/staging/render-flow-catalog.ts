import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createFlowBuildContext } from "./flow-build-context.js";
import type {
  FlowCatalog,
  RenderFlowCatalogOptions,
  RenderFlowCatalogResult,
  RenderedFlowArtifact,
} from "./types.js";

const PLACEHOLDER_PATTERN = /\$\{([A-Za-z0-9_.-]+)\}/g;

function ensureUniqueCatalogKeys(catalog: FlowCatalog): void {
  const seen = new Set<string>();
  for (const spec of catalog) {
    if (seen.has(spec.key)) {
      throw new Error(`Duplicate flow key "${spec.key}" detected.`);
    }
    seen.add(spec.key);
  }
}

function ensureUniqueCatalogFilenames(catalog: FlowCatalog): void {
  const seen = new Set<string>();
  for (const spec of catalog) {
    if (seen.has(spec.filename)) {
      throw new Error(`Duplicate flow filename "${spec.filename}" detected.`);
    }
    seen.add(spec.filename);
  }
}

function ensureDeclaredDependenciesExist(catalog: FlowCatalog): void {
  const knownKeys = new Set(catalog.map((spec) => spec.key));
  for (const spec of catalog) {
    for (const dependency of spec.dependsOnFlows ?? []) {
      if (!knownKeys.has(dependency)) {
        throw new Error(
          `Flow "${spec.key}" declares unknown flow dependency "${dependency}".`,
        );
      }
    }
  }
}

function ensureNoDependencyCycles(catalog: FlowCatalog): void {
  const dependencies = new Map(
    catalog.map((spec) => [spec.key, [...(spec.dependsOnFlows ?? [])]]),
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(key: string, trail: string[]): void {
    if (visited.has(key)) {
      return;
    }
    if (visiting.has(key)) {
      throw new Error(
        `Flow dependency cycle detected: ${[...trail, key].join(" -> ")}.`,
      );
    }

    visiting.add(key);
    for (const dependency of dependencies.get(key) ?? []) {
      visit(dependency, [...trail, key]);
    }
    visiting.delete(key);
    visited.add(key);
  }

  for (const key of dependencies.keys()) {
    visit(key, []);
  }
}

function collectUnresolvedPlaceholders(content: string): readonly string[] {
  const matches = new Set<string>();
  for (const match of content.matchAll(PLACEHOLDER_PATTERN)) {
    matches.add(match[0]);
  }
  return [...matches].sort();
}

function createContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function renderFlowCatalog(
  options: RenderFlowCatalogOptions,
): RenderFlowCatalogResult {
  const { catalog, environment, bindings } = options;

  ensureUniqueCatalogKeys(catalog);
  ensureUniqueCatalogFilenames(catalog);
  ensureDeclaredDependenciesExist(catalog);
  ensureNoDependencyCycles(catalog);

  const context = createFlowBuildContext(environment, bindings);

  const artifacts: RenderedFlowArtifact[] = catalog.map((spec) => {
    const builtFlow = spec.build(context);
    const definition = builtFlow.toConnectDefinition();

    // CONTACT_FLOW_MODULE requires a Settings block in the content JSON
    // with Success and Error transition declarations. Connect rejects the
    // content without it even though it is not needed at runtime.
    if (spec.type === "CONTACT_FLOW_MODULE" && !definition.Settings) {
      definition.Settings = {
        InputParameters: [],
        OutputParameters: [],
        Transitions: [
          { DisplayName: "Success", ReferenceName: "Success", Description: "" },
          { DisplayName: "Error", ReferenceName: "Error", Description: "" },
        ],
      };
    }

    const content = JSON.stringify(definition, null, 2);

    return {
      key: spec.key,
      name: spec.name,
      type: spec.type,
      filename: spec.filename,
      description: spec.description,
      state: spec.state ?? "ACTIVE",
      tags: Object.freeze({ ...(spec.tags ?? {}) }),
      content,
      hash: createContentHash(content),
      referencedFlowKeys: Object.freeze([...(spec.dependsOnFlows ?? [])]),
      unresolvedPlaceholders: collectUnresolvedPlaceholders(content),
    };
  });

  return {
    artifacts,
    manifest: {
      environment,
      flowCount: artifacts.length,
      flows: artifacts.map((artifact) => ({
        key: artifact.key,
        name: artifact.name,
        type: artifact.type,
        filename: artifact.filename,
        hash: artifact.hash,
        referencedFlowKeys: artifact.referencedFlowKeys,
        unresolvedPlaceholders: artifact.unresolvedPlaceholders,
      })),
    },
  };
}

export function writeRenderedFlowCatalog(
  outputDir: string,
  result: RenderFlowCatalogResult,
): void {
  if (typeof outputDir !== "string" || outputDir.trim().length === 0) {
    throw new Error("Rendered flow catalog outputDir must be a non-empty path.");
  }

  mkdirSync(outputDir, { recursive: true });

  for (const artifact of result.artifacts) {
    writeFileSync(
      path.join(outputDir, artifact.filename),
      `${artifact.content}\n`,
      "utf8",
    );
  }

  writeFileSync(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(result.manifest, null, 2)}\n`,
    "utf8",
  );
}
