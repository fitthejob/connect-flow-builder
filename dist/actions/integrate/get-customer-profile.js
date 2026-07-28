import { BaseActionBuilder } from "../common.js";
export { LOGICAL_OPERATORS } from "../../core/action-constants.js";
export class GetCustomerProfileActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetCustomerProfile");
        this.setParameter("ProfileRequestData", {});
    }
    identifier(name, value) {
        return this.setParameter("ProfileRequestData", {
            IdentifierName: name,
            IdentifierValue: value,
        });
    }
    searchCriteria(criteria, logicalOperator) {
        return this.setParameter("ProfileRequestData", {
            SearchCriteria: criteria,
            LogicalOperator: logicalOperator,
        });
    }
    addSearchCriterion(name, value) {
        const requestData = this.getParameter("ProfileRequestData");
        delete requestData.IdentifierName;
        delete requestData.IdentifierValue;
        const criteria = requestData.SearchCriteria
            ?? [];
        criteria.push({
            IdentifierName: name,
            IdentifierValue: value,
        });
        requestData.SearchCriteria = criteria;
        return this;
    }
    logicalOperator(value) {
        const requestData = this.getParameter("ProfileRequestData");
        requestData.LogicalOperator = value;
        return this;
    }
    responseField(key) {
        const data = this.getParameter("ProfileResponseData")
            ?? [];
        if (!data.includes(key)) {
            data.push(key);
        }
        return this.setParameter("ProfileResponseData", data);
    }
}
