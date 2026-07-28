import { BaseActionBuilder } from "../common.js";
export declare class UpdateCaseActionBuilder extends BaseActionBuilder<UpdateCaseActionBuilder> {
    constructor(id: string);
    linkContactToCase(enabled?: boolean): this;
    caseId(value: string): this;
    caseField(key: string, value: string): this;
}
