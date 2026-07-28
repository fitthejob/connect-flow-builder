import type {
  StartOutboundChatDestinationEndpoint,
  StartOutboundChatInitialSystemMessage,
  StartOutboundChatSourceEndpoint,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class StartOutboundChatContactActionBuilder extends BaseActionBuilder<StartOutboundChatContactActionBuilder> {
  constructor(id: string) {
    super(id, "StartOutboundChatContact");
    this.setParameter("ContactSubtype", "connect:SMS");
  }

  sourceConnectPhoneNumberArn(value: string): this {
    return this.setParameter("SourceEndpoint", {
      Address: value,
      Type: "CONNECT_PHONENUMBER_ARN",
    } satisfies StartOutboundChatSourceEndpoint);
  }

  destinationPhoneNumber(value: string): this {
    return this.setParameter("DestinationEndpoint", {
      Address: value,
      Type: "TELEPHONE_NUMBER",
    } satisfies StartOutboundChatDestinationEndpoint);
  }

  contactFlowArn(value: string): this {
    return this.setParameter("ContactFlowArn", value);
  }

  contactSubtype(value: "connect:SMS"): this {
    return this.setParameter("ContactSubtype", value);
  }

  initialSystemMessage(content: string): this {
    return this.setParameter("InitialSystemMessage", {
      Content: content,
    } satisfies StartOutboundChatInitialSystemMessage);
  }

  relateToCurrentContact(): this {
    return this.setParameter("RelatedContact", "CURRENT");
  }
}
