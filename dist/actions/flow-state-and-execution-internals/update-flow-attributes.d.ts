import { BaseActionBuilder } from "../common.js";
export declare class UpdateFlowAttributesActionBuilder extends BaseActionBuilder<UpdateFlowAttributesActionBuilder> {
    constructor(id: string);
    attribute(key: string, value: string): this;
}
