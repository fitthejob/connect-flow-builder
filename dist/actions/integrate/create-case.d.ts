import { BaseActionBuilder } from "../common.js";
export declare class CreateCaseActionBuilder extends BaseActionBuilder<CreateCaseActionBuilder> {
    constructor(id: string);
    linkContactToCase(enabled?: boolean): this;
    caseTemplateId(value: string): this;
    caseField(key: string, value: string): this;
}
