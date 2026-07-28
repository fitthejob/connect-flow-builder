import { BaseActionBuilder } from "../common.js";
export declare class AssociateContactToCustomerProfileActionBuilder extends BaseActionBuilder<AssociateContactToCustomerProfileActionBuilder> {
    constructor(id: string);
    profileId(value: string): this;
    contactId(value: string): this;
}
