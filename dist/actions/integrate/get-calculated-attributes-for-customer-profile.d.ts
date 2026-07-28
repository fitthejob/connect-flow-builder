import { BaseActionBuilder } from "../common.js";
export declare class GetCalculatedAttributesForCustomerProfileActionBuilder extends BaseActionBuilder<GetCalculatedAttributesForCustomerProfileActionBuilder> {
    constructor(id: string);
    profileId(value: string): this;
    responseField(name: string): this;
}
