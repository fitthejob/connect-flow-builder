import { BaseActionBuilder } from "../common.js";
export class UpdateRoutingCriteriaActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateRoutingCriteria");
    }
    routingCriteria(criteria) {
        return this.setParameter("RoutingCriteria", criteria);
    }
    staticRoutingCriteria() {
        return this.setParameter("RoutingCriteria", { Steps: [] });
    }
    addAttributeConditionStep(condition, durationInSeconds) {
        return this.addStep({
            Expression: {
                AttributeCondition: condition,
            },
            Expiry: {
                DurationInSeconds: durationInSeconds,
            },
        });
    }
    addAndExpressionStep(conditions, durationInSeconds) {
        return this.addStep({
            Expression: {
                AndExpression: conditions,
            },
            Expiry: {
                DurationInSeconds: durationInSeconds,
            },
        });
    }
    addStep(step) {
        const routingCriteria = this.getOrCreateStaticRoutingCriteria();
        routingCriteria.Steps.push(step);
        return this;
    }
    getOrCreateStaticRoutingCriteria() {
        if (!("RoutingCriteria" in this.parameters) || typeof this.parameters.RoutingCriteria === "string") {
            this.parameters.RoutingCriteria = { Steps: [] };
        }
        return this.parameters.RoutingCriteria;
    }
}
