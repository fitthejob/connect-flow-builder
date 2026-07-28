import type { FlowSegment } from "../core/types.js";
export interface StandardLexEntryProps {
    greetingText: string;
    lexPromptText: string;
    lexBotAliasArn: string;
    nextActionId: string;
    transferActionId: string;
    greetingActionId?: string;
    inputActionId?: string;
}
export declare function buildStandardLexEntry(props: StandardLexEntryProps): FlowSegment;
