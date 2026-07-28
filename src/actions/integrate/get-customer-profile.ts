import type { CustomerProfileSearchCriterion, LogicalOperator } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { LOGICAL_OPERATORS } from "../../core/action-constants.js";

export class GetCustomerProfileActionBuilder extends BaseActionBuilder<GetCustomerProfileActionBuilder> {
  constructor(id: string) {
    super(id, "GetCustomerProfile");
    this.setParameter("ProfileRequestData", {});
  }

  identifier(name: string, value: string): this {
    return this.setParameter("ProfileRequestData", {
      IdentifierName: name,
      IdentifierValue: value,
    });
  }

  searchCriteria(criteria: CustomerProfileSearchCriterion[], logicalOperator: LogicalOperator): this {
    return this.setParameter("ProfileRequestData", {
      SearchCriteria: criteria,
      LogicalOperator: logicalOperator,
    });
  }

  addSearchCriterion(name: string, value: string): this {
    const requestData =
      this.getParameter<Record<string, unknown>>("ProfileRequestData");
    delete requestData.IdentifierName;
    delete requestData.IdentifierValue;
    const criteria =
      (requestData.SearchCriteria as CustomerProfileSearchCriterion[] | undefined)
      ?? [];
    criteria.push({
      IdentifierName: name,
      IdentifierValue: value,
    });
    requestData.SearchCriteria = criteria;
    return this;
  }

  logicalOperator(value: LogicalOperator): this {
    const requestData =
      this.getParameter<Record<string, unknown>>("ProfileRequestData");
    requestData.LogicalOperator = value;
    return this;
  }

  responseField(key: string): this {
    const data =
      this.getParameter<string[] | undefined>("ProfileResponseData")
      ?? [];
    if (!data.includes(key)) {
      data.push(key);
    }
    return this.setParameter("ProfileResponseData", data);
  }
}
