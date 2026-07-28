import type { FlowSegment } from "../core/types.js";
export interface ConnectAssistantProps {
    wisdomAssistantArn: string;
    nextActionId: string;
    errorActionId: string;
    createWisdomSessionActionId?: string;
    setContactDataActionId?: string;
}
export declare function buildConnectAssistant(props: ConnectAssistantProps): FlowSegment;
