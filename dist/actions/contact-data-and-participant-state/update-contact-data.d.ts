import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactDataActionBuilder extends BaseActionBuilder<UpdateContactDataActionBuilder> {
    constructor(id: string);
    targetCurrent(): this;
    targetRelated(): this;
    name(value: string): this;
    description(value: string): this;
    languageCode(value: string): this;
    customerId(value: string): this;
    reference(key: string, value: string): this;
    voiceIdStreamingEnabled(enabled?: boolean): this;
    voiceAuthenticationEnabled(enabled?: boolean): this;
    fraudDetectionEnabled(enabled?: boolean): this;
    voiceAuthenticationThreshold(value: number | string): this;
    voiceAuthenticationResponseTime(value: number | string): this;
    fraudDetectionThreshold(value: number | string): this;
    watchlistId(value: string): this;
    wisdomSessionArn(value: string): this;
}
