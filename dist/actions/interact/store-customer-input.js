import { BaseActionBuilder } from "../common.js";
export class StoreCustomerInputActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetParticipantInput");
        this.setParameter("StoreInput", "True");
        this.setParameter("InputTimeLimitSeconds", "5");
        this.setParameter("DTMFConfiguration", {
            DisableCancelKey: "False",
            InterdigitTimeLimitSeconds: "5",
        });
        this.setParameter("InputValidation", {
            CustomValidation: {
                MaximumLength: "20",
            },
        });
    }
    inputTimeLimitSeconds(value) {
        return this.setParameter("InputTimeLimitSeconds", String(value));
    }
    interdigitTimeLimitSeconds(value) {
        const dtmfConfiguration = this.getParameter("DTMFConfiguration");
        dtmfConfiguration.InterdigitTimeLimitSeconds = String(value);
        return this;
    }
    maximumDigits(value) {
        const inputValidation = this.getParameter("InputValidation");
        const customValidation = inputValidation.CustomValidation;
        customValidation.MaximumLength = String(value);
        return this;
    }
    disableCancelKey(value = true) {
        const dtmfConfiguration = this.getParameter("DTMFConfiguration");
        dtmfConfiguration.DisableCancelKey = value ? "True" : "False";
        return this;
    }
}
