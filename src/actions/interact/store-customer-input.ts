import { BaseActionBuilder } from "../common.js";

export class StoreCustomerInputActionBuilder extends BaseActionBuilder<StoreCustomerInputActionBuilder> {
  constructor(id: string) {
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

  inputTimeLimitSeconds(value: number): this {
    return this.setParameter("InputTimeLimitSeconds", String(value));
  }

  interdigitTimeLimitSeconds(value: number): this {
    const dtmfConfiguration =
      this.getParameter<Record<string, unknown>>("DTMFConfiguration");
    dtmfConfiguration.InterdigitTimeLimitSeconds = String(value);
    return this;
  }

  maximumDigits(value: number): this {
    const inputValidation =
      this.getParameter<Record<string, unknown>>("InputValidation");
    const customValidation =
      inputValidation.CustomValidation as Record<string, unknown>;
    customValidation.MaximumLength = String(value);
    return this;
  }

  disableCancelKey(value = true): this {
    const dtmfConfiguration =
      this.getParameter<Record<string, unknown>>("DTMFConfiguration");
    dtmfConfiguration.DisableCancelKey = value ? "True" : "False";
    return this;
  }
}
