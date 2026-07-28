import { BaseActionBuilder } from "../common.js";
export declare class StoreCustomerInputActionBuilder extends BaseActionBuilder<StoreCustomerInputActionBuilder> {
    constructor(id: string);
    inputTimeLimitSeconds(value: number): this;
    interdigitTimeLimitSeconds(value: number): this;
    maximumDigits(value: number): this;
    disableCancelKey(value?: boolean): this;
}
