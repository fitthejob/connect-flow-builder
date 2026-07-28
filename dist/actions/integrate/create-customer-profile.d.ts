import { BaseActionBuilder } from "../common.js";
export declare class CreateCustomerProfileActionBuilder extends BaseActionBuilder<CreateCustomerProfileActionBuilder> {
    constructor(id: string);
    requestField(key: string, value: string): this;
    responseField(key: string): this;
}
