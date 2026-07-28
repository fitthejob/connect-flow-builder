import type { EvaluateDataTablePrimaryValue, EvaluateDataTableQuery } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class EvaluateDataTableValuesActionBuilder extends BaseActionBuilder<EvaluateDataTableValuesActionBuilder> {
    constructor(id: string);
    dataTableId(value: string): this;
    queries(value: EvaluateDataTableQuery[]): this;
    addQuery(query: EvaluateDataTableQuery): this;
    query(queryName: string, attributes: string[], primaryValues: EvaluateDataTablePrimaryValue[]): this;
}
