import { BaseActionBuilder } from "../common.js";

export class UpdateContactDataActionBuilder extends BaseActionBuilder<UpdateContactDataActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactData");
    this.setParameter("TargetContact", "Current");
  }

  targetCurrent(): this {
    return this.setParameter("TargetContact", "Current");
  }

  targetRelated(): this {
    return this.setParameter("TargetContact", "Related");
  }

  name(value: string): this {
    return this.setParameter("Name", value);
  }

  description(value: string): this {
    return this.setParameter("Description", value);
  }

  languageCode(value: string): this {
    return this.setParameter("LanguageCode", value);
  }

  customerId(value: string): this {
    return this.setParameter("CustomerId", value);
  }

  reference(key: string, value: string): this {
    const references =
      this.getParameter<Record<string, string> | undefined>("References")
      ?? {};
    references[key] = value;
    return this.setParameter("References", references);
  }

  voiceIdStreamingEnabled(enabled = true): this {
    return this.setParameter("IsVoiceIdStreamingEnabled", enabled ? "TRUE" : "FALSE");
  }

  voiceAuthenticationEnabled(enabled = true): this {
    return this.setParameter("IsVoiceAuthenticationEnabled", enabled ? "TRUE" : "FALSE");
  }

  fraudDetectionEnabled(enabled = true): this {
    return this.setParameter("IsFraudDetectionEnabled", enabled ? "TRUE" : "FALSE");
  }

  voiceAuthenticationThreshold(value: number | string): this {
    return this.setParameter("VoiceAuthenticationThreshold", String(value));
  }

  voiceAuthenticationResponseTime(value: number | string): this {
    return this.setParameter("VoiceAuthenticationResponseTime", String(value));
  }

  fraudDetectionThreshold(value: number | string): this {
    return this.setParameter("FraudDetectionThreshold", String(value));
  }

  watchlistId(value: string): this {
    return this.setParameter("WatchlistId", value);
  }

  wisdomSessionArn(value: string): this {
    return this.setParameter("WisdomSessionArn", value);
  }
}
