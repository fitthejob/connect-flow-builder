import { BaseActionBuilder } from "../common.js";

export class GetCaseActionBuilder extends BaseActionBuilder<GetCaseActionBuilder> {
  constructor(id: string) {
    super(id, "GetCase");
    this.setParameter("LinkContactToCase", "false");
    this.setParameter("GetLastUpdatedCase", "false");
  }

  linkContactToCase(enabled = true): this {
    return this.setParameter("LinkContactToCase", enabled ? "true" : "false");
  }

  getLastUpdatedCase(enabled = true): this {
    return this.setParameter("GetLastUpdatedCase", enabled ? "true" : "false");
  }

  customerId(value: string): this {
    return this.setParameter("CustomerId", value);
  }

  caseRequestField(key: string, value: string): this {
    const fields =
      this.getParameter<Record<string, string> | undefined>("CaseRequestFields")
      ?? {};
    fields[key] = value;
    return this.setParameter("CaseRequestFields", fields);
  }

  caseResponseField(value: string): this {
    const fields =
      this.getParameter<string[] | undefined>("CaseResponseFields")
      ?? [];
    fields.push(value);
    return this.setParameter("CaseResponseFields", fields);
  }
}
