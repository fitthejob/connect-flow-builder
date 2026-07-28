import type { RoutingCriteriaAttributeCondition, RoutingCriteriaObject, RoutingCriteriaStep } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class UpdateRoutingCriteriaActionBuilder extends BaseActionBuilder<UpdateRoutingCriteriaActionBuilder> {
    constructor(id: string);
    routingCriteria(criteria: RoutingCriteriaObject | string): this;
    staticRoutingCriteria(): this;
    addAttributeConditionStep(condition: RoutingCriteriaAttributeCondition, durationInSeconds: number): this;
    addAndExpressionStep(conditions: RoutingCriteriaAttributeCondition[], durationInSeconds: number): this;
    addStep(step: RoutingCriteriaStep): this;
    private getOrCreateStaticRoutingCriteria;
}
