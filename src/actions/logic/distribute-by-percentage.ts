import { numberLessThanCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";

export class DistributeByPercentageActionBuilder extends BaseActionBuilder<DistributeByPercentageActionBuilder> {
  constructor(id: string) {
    super(id, "DistributeByPercentage");
  }

  addDistribution(percentage: number, nextAction: string): this {
    const nextThreshold = this.currentThreshold() + percentage;
    return this.whenLessThan(nextThreshold, nextAction);
  }

  whenLessThan(cumulativeThreshold: number, nextAction: string): this {
    this.when(numberLessThanCondition(String(cumulativeThreshold)), nextAction);
    return this;
  }

  onError(nextAction: string, errorType = "NoMatchingCondition"): this {
    super.onError(nextAction, errorType);
    return this;
  }

  private currentThreshold(): number {
    const conditions = this.transitions.conditions ?? [];
    if (conditions.length === 0) {
      return 0;
    }

    const lastOperand = conditions[conditions.length - 1]?.condition.operands[0];
    return Number(lastOperand ?? 0);
  }
}
