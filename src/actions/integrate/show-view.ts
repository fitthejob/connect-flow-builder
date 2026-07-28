import { BaseActionBuilder } from "../common.js";

export class ShowViewActionBuilder extends BaseActionBuilder<ShowViewActionBuilder> {
  constructor(id: string) {
    super(id, "ShowView");
  }

  viewResource(id: string, version: string): this {
    return this.setParameter("ViewResource", {
      Id: id,
      Version: version,
    });
  }

  invocationTimeLimitSeconds(value: number): this {
    return this.setParameter("InvocationTimeLimitSeconds", value);
  }

  viewData(name: string, value: string): this {
    const viewData = this.getParameter<Record<string, string> | undefined>("ViewData") ?? {};
    viewData[name] = value;
    return this.setParameter("ViewData", viewData);
  }

  hideResponseOnTranscript(): this {
    return this.setParameter("SensitiveDataConfiguration", {
      HideResponseOn: ["TRANSCRIPT"],
    });
  }
}
