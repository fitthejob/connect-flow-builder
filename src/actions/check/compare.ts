import { BaseActionBuilder } from "../common.js";

export class CompareActionBuilder extends BaseActionBuilder<CompareActionBuilder> {
  constructor(id: string) {
    super(id, "Compare");
  }

  comparisonValue(jsonPath: string): this {
    return this.setParameter("ComparisonValue", jsonPath);
  }

  onError(nextAction: string, errorType = "NoMatchingCondition"): this {
    super.onError(nextAction, errorType);
    return this;
  }
}
