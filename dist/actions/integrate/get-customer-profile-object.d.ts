import { BaseActionBuilder } from "../common.js";
export declare class GetCustomerProfileObjectActionBuilder extends BaseActionBuilder<GetCustomerProfileObjectActionBuilder> {
    constructor(id: string);
    profileId(value: string): this;
    objectType(value: string): this;
    identifier(name: string, value: string): this;
    useLatest(enabled?: boolean): this;
    responseField(key: string): this;
}
