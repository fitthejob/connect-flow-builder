import { BaseActionBuilder } from "../common.js";
export class ShowViewActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "ShowView");
    }
    viewResource(id, version) {
        return this.setParameter("ViewResource", {
            Id: id,
            Version: version,
        });
    }
    invocationTimeLimitSeconds(value) {
        return this.setParameter("InvocationTimeLimitSeconds", value);
    }
    viewData(name, value) {
        const viewData = this.getParameter("ViewData") ?? {};
        viewData[name] = value;
        return this.setParameter("ViewData", viewData);
    }
    hideResponseOnTranscript() {
        return this.setParameter("SensitiveDataConfiguration", {
            HideResponseOn: ["TRANSCRIPT"],
        });
    }
}
