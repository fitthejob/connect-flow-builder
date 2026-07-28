import type {
  RoutingCriteriaAttributeCondition,
  RoutingCriteriaObject,
  RoutingCriteriaStep,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class UpdateRoutingCriteriaActionBuilder extends BaseActionBuilder<UpdateRoutingCriteriaActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateRoutingCriteria");
  }

  routingCriteria(criteria: RoutingCriteriaObject | string): this {
    return this.setParameter("RoutingCriteria", criteria);
  }

  staticRoutingCriteria(): this {
    return this.setParameter("RoutingCriteria", { Steps: [] });
  }

  addAttributeConditionStep(
    condition: RoutingCriteriaAttributeCondition,
    durationInSeconds: number,
  ): this {
    return this.addStep({
      Expression: {
        AttributeCondition: condition,
      },
      Expiry: {
        DurationInSeconds: durationInSeconds,
      },
    });
  }

  addAndExpressionStep(
    conditions: RoutingCriteriaAttributeCondition[],
    durationInSeconds: number,
  ): this {
    return this.addStep({
      Expression: {
        AndExpression: conditions,
      },
      Expiry: {
        DurationInSeconds: durationInSeconds,
      },
    });
  }

  addStep(step: RoutingCriteriaStep): this {
    const routingCriteria = this.getOrCreateStaticRoutingCriteria();
    routingCriteria.Steps.push(step);
    return this;
  }

  private getOrCreateStaticRoutingCriteria(): RoutingCriteriaObject {
    if (!("RoutingCriteria" in this.parameters) || typeof this.parameters.RoutingCriteria === "string") {
      this.parameters.RoutingCriteria = { Steps: [] };
    }

    return this.parameters.RoutingCriteria as RoutingCriteriaObject;
  }
}
