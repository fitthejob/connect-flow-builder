import { BaseActionBuilder } from "../common.js";
export declare class UnTagContactActionBuilder extends BaseActionBuilder<UnTagContactActionBuilder> {
    constructor(id: string);
    key(value: string): this;
    keys(...values: string[]): this;
}
