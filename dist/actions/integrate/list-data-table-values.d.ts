import type { DataTablePrimaryKeyGroup, DataTablePrimaryValue } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class ListDataTableValuesActionBuilder extends BaseActionBuilder<ListDataTableValuesActionBuilder> {
    constructor(id: string);
    dataTableId(value: string): this;
    primaryKeyGroups(value: DataTablePrimaryKeyGroup[]): this;
    addPrimaryKeyGroup(group: DataTablePrimaryKeyGroup): this;
    primaryKeyGroup(primaryKeyGroupName: string, primaryValues: DataTablePrimaryValue[]): this;
}
