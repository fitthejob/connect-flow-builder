import { BaseActionBuilder } from "../common.js";
export declare class UpdateCustomerProfileActionBuilder extends BaseActionBuilder<UpdateCustomerProfileActionBuilder> {
    constructor(id: string);
    requestField(key: string, value: string): this;
    responseField(key: string): this;
}
