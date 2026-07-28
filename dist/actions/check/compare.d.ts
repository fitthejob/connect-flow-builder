import { BaseActionBuilder } from "../common.js";
export declare class CompareActionBuilder extends BaseActionBuilder<CompareActionBuilder> {
    constructor(id: string);
    comparisonValue(jsonPath: string): this;
    onError(nextAction: string, errorType?: string): this;
}
