import { BaseActionBuilder } from "../common.js";
export class CompareActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "Compare");
    }
    comparisonValue(jsonPath) {
        return this.setParameter("ComparisonValue", jsonPath);
    }
    onError(nextAction, errorType = "NoMatchingCondition") {
        super.onError(nextAction, errorType);
        return this;
    }
}
