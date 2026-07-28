export declare const amazonConnectActionCatalogSource: Readonly<{
    verifiedOn: "2026-06-13";
    developerGuideTocUrl: "https://docs.aws.amazon.com/connect/latest/devguide/toc-contents.json";
    developerGuideActionsOverviewUrl: "https://docs.aws.amazon.com/connect/latest/devguide/flow-language-actions.html";
    adminGuideTocUrl: "https://docs.aws.amazon.com/connect/latest/adminguide/toc-contents.json";
    apiReferenceBaseUrl: "https://docs.aws.amazon.com/connect/latest/APIReference/";
}>;
export declare const FLOW_DESIGNER_UI_CATEGORIES: readonly ["INTERACT", "SET", "CHECK", "ANALYZE", "LOGIC", "INTEGRATE", "TERMINATE"];
export declare const CORE_FUNCTION_CATEGORIES: readonly ["Bot and assistant internals", "Contact data and participant state", "Flow state and execution internals", "Outbound and callback operations", "Queue and hold messaging", "Routing and transfer internals"];
export declare const AMAZON_CONNECT_ACTION_CATEGORIES: readonly ["INTERACT", "SET", "CHECK", "ANALYZE", "LOGIC", "INTEGRATE", "TERMINATE", "Bot and assistant internals", "Contact data and participant state", "Flow state and execution internals", "Outbound and callback operations", "Queue and hold messaging", "Routing and transfer internals"];
export type FlowDesignerUiCategory = (typeof FLOW_DESIGNER_UI_CATEGORIES)[number];
export type CoreFunctionCategory = (typeof CORE_FUNCTION_CATEGORIES)[number];
export type AmazonConnectActionCategory = (typeof AMAZON_CONNECT_ACTION_CATEGORIES)[number];
export type AmazonConnectActionCategorySource = "ui" | "core";
export type AmazonConnectActionSurfaceKind = "flow-language-action" | "designer-block";
export type AmazonConnectDocKind = "developer-guide" | "admin-guide" | "api-reference";
export type PackageCoverageStatus = "implemented" | "implementable-now" | "blocked";
export type PackageSurfaceKind = "action-builder" | "ui-wrapper-builder" | "composite-helper";
export interface AmazonConnectCatalogDocReference {
    kind: AmazonConnectDocKind;
    path: string;
    url: string;
}
export interface AmazonConnectActionCatalogEntry {
    awsAction: string;
    underlyingAwsAction?: string;
    surfaceKind: AmazonConnectActionSurfaceKind;
    category: AmazonConnectActionCategory;
    categorySource: AmazonConnectActionCategorySource;
    uiEquivalents: readonly string[];
    docs: readonly AmazonConnectCatalogDocReference[];
    packageCoverage: {
        status: PackageCoverageStatus;
        packageSurfaceKind?: PackageSurfaceKind;
        packageActionType?: string;
        packageExportName?: string;
        builderClassName?: string;
        definitionModule?: string;
        builderModule?: string;
        rootExported?: boolean;
        notes?: string;
    };
    notes?: string;
}
export declare const amazonConnectActionCatalog: readonly [AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry, AmazonConnectActionCatalogEntry];
export declare const amazonConnectActionCatalogByCategory: Readonly<Record<"INTERACT" | "SET" | "CHECK" | "ANALYZE" | "LOGIC" | "INTEGRATE" | "TERMINATE" | "Bot and assistant internals" | "Contact data and participant state" | "Flow state and execution internals" | "Outbound and callback operations" | "Queue and hold messaging" | "Routing and transfer internals", readonly AmazonConnectActionCatalogEntry[]>>;
export declare const implementedAmazonConnectActions: AmazonConnectActionCatalogEntry[];
export declare const implementedActionBuilderAmazonConnectActions: AmazonConnectActionCatalogEntry[];
export declare const implementedCompositeAmazonConnectActions: AmazonConnectActionCatalogEntry[];
export declare const implementableNowAmazonConnectActions: AmazonConnectActionCatalogEntry[];
export declare const blockedAmazonConnectActions: AmazonConnectActionCatalogEntry[];
