import type { BuiltFlow } from "../core/flow-builder.js";

export type ConnectFlowResourceType =
  | "CONTACT_FLOW"
  | "CONTACT_FLOW_MODULE"
  | "CUSTOMER_QUEUE"
  | "CUSTOMER_HOLD"
  | "CUSTOMER_WHISPER"
  | "AGENT_HOLD"
  | "AGENT_WHISPER"
  | "OUTBOUND_WHISPER"
  | "AGENT_TRANSFER"
  | "QUEUE_TRANSFER"
  | "CAMPAIGN";

export type FlowResourceBindingMap = Readonly<Record<string, string>>;

export interface FlowBindings {
  queues?: FlowResourceBindingMap;
  lambdas?: FlowResourceBindingMap;
  lexBotAliases?: FlowResourceBindingMap;
  prompts?: FlowResourceBindingMap;
  hoursOfOperation?: FlowResourceBindingMap;
  flowArns?: FlowResourceBindingMap;
  flowIds?: FlowResourceBindingMap;
  custom?: FlowResourceBindingMap;
}

export interface NormalizedFlowBindings {
  queues: FlowResourceBindingMap;
  lambdas: FlowResourceBindingMap;
  lexBotAliases: FlowResourceBindingMap;
  prompts: FlowResourceBindingMap;
  hoursOfOperation: FlowResourceBindingMap;
  flowArns: FlowResourceBindingMap;
  flowIds: FlowResourceBindingMap;
  custom: FlowResourceBindingMap;
}

export interface FlowBuildReferences {
  queueArn(key: string): string;
  lambdaArn(key: string): string;
  lexBotAliasArn(key: string): string;
  promptArn(key: string): string;
  hoursOfOperationArn(key: string): string;
  flowArn(key: string): string;
  flowId(key: string): string;
  custom(key: string): string;
}

export interface FlowBuildContext {
  environment: string;
  bindings: NormalizedFlowBindings;
  refs: FlowBuildReferences;
}

export interface FlowSpec {
  key: string;
  name: string;
  type: ConnectFlowResourceType;
  filename: string;
  description?: string;
  state?: "ACTIVE" | "ARCHIVED";
  tags?: Readonly<Record<string, string>>;
  dependsOnFlows?: readonly string[];
  build(context: FlowBuildContext): BuiltFlow;
}

export type FlowCatalog = readonly FlowSpec[];

export interface RenderedFlowArtifact {
  key: string;
  name: string;
  type: ConnectFlowResourceType;
  filename: string;
  description?: string;
  state: "ACTIVE" | "ARCHIVED";
  tags: Readonly<Record<string, string>>;
  content: string;
  hash: string;
  referencedFlowKeys: readonly string[];
  unresolvedPlaceholders: readonly string[];
}

export interface RenderedFlowManifestEntry {
  key: string;
  name: string;
  type: ConnectFlowResourceType;
  filename: string;
  hash: string;
  referencedFlowKeys: readonly string[];
  unresolvedPlaceholders: readonly string[];
}

export interface RenderedFlowManifest {
  environment: string;
  flowCount: number;
  flows: readonly RenderedFlowManifestEntry[];
}

export interface RenderFlowCatalogOptions {
  catalog: FlowCatalog;
  environment: string;
  bindings?: FlowBindings;
}

export interface RenderFlowCatalogResult {
  artifacts: readonly RenderedFlowArtifact[];
  manifest: RenderedFlowManifest;
}
