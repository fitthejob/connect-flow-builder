import { BaseActionBuilder } from "../common.js";
export class GetCaseActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetCase");
        this.setParameter("LinkContactToCase", "false");
        this.setParameter("GetLastUpdatedCase", "false");
    }
    linkContactToCase(enabled = true) {
        return this.setParameter("LinkContactToCase", enabled ? "true" : "false");
    }
    getLastUpdatedCase(enabled = true) {
        return this.setParameter("GetLastUpdatedCase", enabled ? "true" : "false");
    }
    customerId(value) {
        return this.setParameter("CustomerId", value);
    }
    caseRequestField(key, value) {
        const fields = this.getParameter("CaseRequestFields")
            ?? {};
        fields[key] = value;
        return this.setParameter("CaseRequestFields", fields);
    }
    caseResponseField(value) {
        const fields = this.getParameter("CaseResponseFields")
            ?? [];
        fields.push(value);
        return this.setParameter("CaseResponseFields", fields);
    }
}
