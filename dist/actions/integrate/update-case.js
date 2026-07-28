import { BaseActionBuilder } from "../common.js";
export class UpdateCaseActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateCase");
        this.setParameter("LinkContactToCase", "false");
    }
    linkContactToCase(enabled = true) {
        return this.setParameter("LinkContactToCase", enabled ? "true" : "false");
    }
    caseId(value) {
        return this.setParameter("CaseId", value);
    }
    caseField(key, value) {
        const fields = this.getParameter("CaseRequestFields")
            ?? {};
        fields[key] = value;
        return this.setParameter("CaseRequestFields", fields);
    }
}
