import { BaseActionBuilder } from "../common.js";
export declare class StartOutboundChatContactActionBuilder extends BaseActionBuilder<StartOutboundChatContactActionBuilder> {
    constructor(id: string);
    sourceConnectPhoneNumberArn(value: string): this;
    destinationPhoneNumber(value: string): this;
    contactFlowArn(value: string): this;
    contactSubtype(value: "connect:SMS"): this;
    initialSystemMessage(content: string): this;
    relateToCurrentContact(): this;
}
