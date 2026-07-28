import { BaseActionBuilder } from "../common.js";
export class CreateCaseActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CreateCase");
        this.setParameter("LinkContactToCase", "false");
    }
    linkContactToCase(enabled = true) {
        return this.setParameter("LinkContactToCase", enabled ? "true" : "false");
    }
    caseTemplateId(value) {
        return this.setParameter("CaseTemplateId", value);
    }
    caseField(key, value) {
        const fields = this.getParameter("CaseRequestFields")
            ?? {};
        fields[key] = value;
        return this.setParameter("CaseRequestFields", fields);
    }
}
