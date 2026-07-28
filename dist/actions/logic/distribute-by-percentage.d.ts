import { BaseActionBuilder } from "../common.js";
export declare class DistributeByPercentageActionBuilder extends BaseActionBuilder<DistributeByPercentageActionBuilder> {
    constructor(id: string);
    addDistribution(percentage: number, nextAction: string): this;
    whenLessThan(cumulativeThreshold: number, nextAction: string): this;
    onError(nextAction: string, errorType?: string): this;
    private currentThreshold;
}
