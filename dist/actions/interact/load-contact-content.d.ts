import type { LoadContactContentType } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { LOAD_CONTACT_CONTENT_TYPES } from "../../core/action-constants.js";
export declare class LoadContactContentActionBuilder extends BaseActionBuilder<LoadContactContentActionBuilder> {
    constructor(id: string);
    contentType(value: LoadContactContentType): this;
    emailMessage(): this;
}
