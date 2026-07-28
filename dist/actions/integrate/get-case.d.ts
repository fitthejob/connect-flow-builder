import { BaseActionBuilder } from "../common.js";
export declare class GetCaseActionBuilder extends BaseActionBuilder<GetCaseActionBuilder> {
    constructor(id: string);
    linkContactToCase(enabled?: boolean): this;
    getLastUpdatedCase(enabled?: boolean): this;
    customerId(value: string): this;
    caseRequestField(key: string, value: string): this;
    caseResponseField(value: string): this;
}
