import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactAttributesActionBuilder extends BaseActionBuilder<UpdateContactAttributesActionBuilder> {
    constructor(id: string);
    targetCurrent(): this;
    targetRelated(): this;
    attribute(key: string, value: string): this;
}
