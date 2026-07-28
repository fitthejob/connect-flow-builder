import { BaseActionBuilder } from "../common.js";

export class CreateCaseActionBuilder extends BaseActionBuilder<CreateCaseActionBuilder> {
  constructor(id: string) {
    super(id, "CreateCase");
    this.setParameter("LinkContactToCase", "false");
  }

  linkContactToCase(enabled = true): this {
    return this.setParameter("LinkContactToCase", enabled ? "true" : "false");
  }

  caseTemplateId(value: string): this {
    return this.setParameter("CaseTemplateId", value);
  }

  caseField(key: string, value: string): this {
    const fields =
      this.getParameter<Record<string, string> | undefined>("CaseRequestFields")
      ?? {};
    fields[key] = value;
    return this.setParameter("CaseRequestFields", fields);
  }
}
