import { BaseActionBuilder } from "../common.js";
export class UpdateContactDataActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactData");
        this.setParameter("TargetContact", "Current");
    }
    targetCurrent() {
        return this.setParameter("TargetContact", "Current");
    }
    targetRelated() {
        return this.setParameter("TargetContact", "Related");
    }
    name(value) {
        return this.setParameter("Name", value);
    }
    description(value) {
        return this.setParameter("Description", value);
    }
    languageCode(value) {
        return this.setParameter("LanguageCode", value);
    }
    customerId(value) {
        return this.setParameter("CustomerId", value);
    }
    reference(key, value) {
        const references = this.getParameter("References")
            ?? {};
        references[key] = value;
        return this.setParameter("References", references);
    }
    voiceIdStreamingEnabled(enabled = true) {
        return this.setParameter("IsVoiceIdStreamingEnabled", enabled ? "TRUE" : "FALSE");
    }
    voiceAuthenticationEnabled(enabled = true) {
        return this.setParameter("IsVoiceAuthenticationEnabled", enabled ? "TRUE" : "FALSE");
    }
    fraudDetectionEnabled(enabled = true) {
        return this.setParameter("IsFraudDetectionEnabled", enabled ? "TRUE" : "FALSE");
    }
    voiceAuthenticationThreshold(value) {
        return this.setParameter("VoiceAuthenticationThreshold", String(value));
    }
    voiceAuthenticationResponseTime(value) {
        return this.setParameter("VoiceAuthenticationResponseTime", String(value));
    }
    fraudDetectionThreshold(value) {
        return this.setParameter("FraudDetectionThreshold", String(value));
    }
    watchlistId(value) {
        return this.setParameter("WatchlistId", value);
    }
    wisdomSessionArn(value) {
        return this.setParameter("WisdomSessionArn", value);
    }
}
