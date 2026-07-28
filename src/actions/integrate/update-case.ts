import { BaseActionBuilder } from "../common.js";

export class UpdateCaseActionBuilder extends BaseActionBuilder<UpdateCaseActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateCase");
    this.setParameter("LinkContactToCase", "false");
  }

  linkContactToCase(enabled = true): this {
    return this.setParameter("LinkContactToCase", enabled ? "true" : "false");
  }

  caseId(value: string): this {
    return this.setParameter("CaseId", value);
  }

  caseField(key: string, value: string): this {
    const fields =
      this.getParameter<Record<string, string> | undefined>("CaseRequestFields")
      ?? {};
    fields[key] = value;
    return this.setParameter("CaseRequestFields", fields);
  }
}
