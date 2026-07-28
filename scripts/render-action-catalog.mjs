import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const {
  AMAZON_CONNECT_ACTION_CATEGORIES,
  FLOW_DESIGNER_UI_CATEGORIES,
  amazonConnectActionCatalog,
  amazonConnectActionCatalogByCategory,
  amazonConnectActionCatalogSource,
  blockedAmazonConnectActions,
  implementedActionBuilderAmazonConnectActions,
  implementedAmazonConnectActions,
  implementedCompositeAmazonConnectActions,
  implementableNowAmazonConnectActions,
} = await import("../dist/catalog/connect-action-catalog.js");

const catalogJsonPath = path.join(
  packageRoot,
  "dist",
  "catalog",
  "connect-action-catalog.json",
);
const catalogDocPath = path.join(
  packageRoot,
  "docs",
  "connect-action-catalog.md",
);

function formatList(values) {
  if (values.length === 0) {
    return "";
  }

  return values.map((value) => `\`${value}\``).join(", ");
}

function formatDocs(docs) {
  return docs
    .map((doc) => `[\`${doc.path}\`](${doc.url})`)
    .join("<br>");
}

function formatPackageSurfaceKind(kind) {
  switch (kind) {
    case "action-builder":
      return "`action-builder`";
    case "ui-wrapper-builder":
      return "`ui-wrapper-builder`";
    case "composite-helper":
      return "`composite-helper`";
    default:
      return "";
  }
}

function formatUnderlyingAwsAction(entry) {
  if (entry.underlyingAwsAction) {
    return `\`${entry.underlyingAwsAction}\``;
  }

  if (entry.surfaceKind === "flow-language-action") {
    return `\`${entry.awsAction}\``;
  }

  return "`unknown`";
}

function formatNotes(entry) {
  const notes = [];

  if (entry.notes) {
    notes.push(entry.notes);
  }

  if (entry.packageCoverage.notes) {
    notes.push(entry.packageCoverage.notes);
  }

  return notes.join(" ");
}

function buildCatalogMarkdown() {
  const totalEntries = amazonConnectActionCatalog.length;
  const implementedEntries = implementedAmazonConnectActions.length;
  const implementedActionBuilderEntries =
    implementedActionBuilderAmazonConnectActions.length;
  const implementedCompositeEntries =
    implementedCompositeAmazonConnectActions.length;
  const implementableNowEntries = implementableNowAmazonConnectActions.length;
  const blockedEntries = blockedAmazonConnectActions.length;

  const lines = [
    "# Amazon Connect Action Catalog",
    "",
    "This file is generated from `src/catalog/connect-action-catalog.ts`.",
    "",
    "Do not hand-edit this file.",
    "",
    "## Source",
    "",
    `- Verified on: \`${amazonConnectActionCatalogSource.verifiedOn}\``,
    `- Developer Guide TOC: \`${amazonConnectActionCatalogSource.developerGuideTocUrl}\``,
    `- Developer Guide actions overview: \`${amazonConnectActionCatalogSource.developerGuideActionsOverviewUrl}\``,
    `- Admin Guide TOC: \`${amazonConnectActionCatalogSource.adminGuideTocUrl}\``,
    `- API Reference base: \`${amazonConnectActionCatalogSource.apiReferenceBaseUrl}\``,
    "",
    "## Snapshot",
    "",
    `- Total catalog entries: \`${totalEntries}\``,
    `- Implemented catalog surfaces: \`${implementedEntries}\``,
    `- Implemented action-builder-backed surfaces: \`${implementedActionBuilderEntries}\``,
    `- Implemented composite-backed surfaces: \`${implementedCompositeEntries}\``,
    `- Implementable-now package entries: \`${implementableNowEntries}\``,
    `- Blocked package entries: \`${blockedEntries}\``,
    "",
    "## Category Model",
    "",
    "The catalog is organized first by the Flow Designer UI categories you supplied:",
    "",
    ...FLOW_DESIGNER_UI_CATEGORIES.map((category) => `- \`${category}\``),
    "",
    "Entries that exist outside those operator-facing groups are categorized by core function instead.",
    "",
    "Coverage status meanings:",
    "",
    "- `implemented`: the package already exposes the catalog surface through a portable builder or a proven composite helper",
    "- `implementable-now`: the underlying AWS action contract is already proven strongly enough to add a UI-aligned wrapper safely",
    "- `blocked`: the package still needs exported Flow Designer JSON or stronger AWS evidence before a stable builder contract should be added",
    "",
  ];

  for (const category of AMAZON_CONNECT_ACTION_CATEGORIES) {
    const entries = amazonConnectActionCatalogByCategory[category];

    lines.push(`## ${category}`);
    lines.push("");
    lines.push(
      `Entries in this category: \`${entries.length}\``,
    );
    lines.push("");
    lines.push(
      "| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |",
    );
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");

    for (const entry of entries) {
      lines.push(
        `| \`${entry.awsAction}\` | ${formatUnderlyingAwsAction(entry)} | \`${entry.surfaceKind}\` | ${formatList(entry.uiEquivalents)} | \`${entry.packageCoverage.status}\` | ${formatPackageSurfaceKind(entry.packageCoverage.packageSurfaceKind)} | ${entry.packageCoverage.packageActionType ? `\`${entry.packageCoverage.packageActionType}\`` : ""} | ${entry.packageCoverage.packageExportName ? `\`${entry.packageCoverage.packageExportName}\`` : ""} | ${formatDocs(entry.docs)} | ${formatNotes(entry)} |`,
      );
    }

    lines.push("");
  }

  lines.push("## Implemented Package Surface");
  lines.push("");
  lines.push("| AWS surface | UI equivalent | Package surface kind | Package type | Package export |");
  lines.push("| --- | --- | --- | --- | --- |");

  for (const entry of implementedAmazonConnectActions) {
    lines.push(
      `| \`${entry.awsAction}\` | ${formatList(entry.uiEquivalents)} | ${formatPackageSurfaceKind(entry.packageCoverage.packageSurfaceKind)} | \`${entry.packageCoverage.packageActionType ?? ""}\` | \`${entry.packageCoverage.packageExportName ?? ""}\` |`,
    );
  }

  lines.push("");

  return `${lines.join("\n")}\n`;
}

await mkdir(path.dirname(catalogJsonPath), { recursive: true });
await writeFile(
  catalogJsonPath,
  `${JSON.stringify(amazonConnectActionCatalog, null, 2)}\n`,
  "utf8",
);
await writeFile(catalogDocPath, buildCatalogMarkdown(), "utf8");
