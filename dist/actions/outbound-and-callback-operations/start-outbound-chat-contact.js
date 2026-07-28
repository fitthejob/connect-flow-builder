import { BaseActionBuilder } from "../common.js";
export class StartOutboundChatContactActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "StartOutboundChatContact");
        this.setParameter("ContactSubtype", "connect:SMS");
    }
    sourceConnectPhoneNumberArn(value) {
        return this.setParameter("SourceEndpoint", {
            Address: value,
            Type: "CONNECT_PHONENUMBER_ARN",
        });
    }
    destinationPhoneNumber(value) {
        return this.setParameter("DestinationEndpoint", {
            Address: value,
            Type: "TELEPHONE_NUMBER",
        });
    }
    contactFlowArn(value) {
        return this.setParameter("ContactFlowArn", value);
    }
    contactSubtype(value) {
        return this.setParameter("ContactSubtype", value);
    }
    initialSystemMessage(content) {
        return this.setParameter("InitialSystemMessage", {
            Content: content,
        });
    }
    relateToCurrentContact() {
        return this.setParameter("RelatedContact", "CURRENT");
    }
}
