import { numberLessThanCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export class DistributeByPercentageActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "DistributeByPercentage");
    }
    addDistribution(percentage, nextAction) {
        const nextThreshold = this.currentThreshold() + percentage;
        return this.whenLessThan(nextThreshold, nextAction);
    }
    whenLessThan(cumulativeThreshold, nextAction) {
        this.when(numberLessThanCondition(String(cumulativeThreshold)), nextAction);
        return this;
    }
    onError(nextAction, errorType = "NoMatchingCondition") {
        super.onError(nextAction, errorType);
        return this;
    }
    currentThreshold() {
        const conditions = this.transitions.conditions ?? [];
        if (conditions.length === 0) {
            return 0;
        }
        const lastOperand = conditions[conditions.length - 1]?.condition.operands[0];
        return Number(lastOperand ?? 0);
    }
}
