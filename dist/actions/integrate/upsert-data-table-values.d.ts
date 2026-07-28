import type { DataTablePrimaryValue, DataTableUpsertAttributeGroup, DataTableUpsertAttributeValue } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class UpsertDataTableValuesActionBuilder extends BaseActionBuilder<UpsertDataTableValuesActionBuilder> {
    constructor(id: string);
    lockVersion(value: string): this;
    latestLockVersion(): this;
    dataTableId(value: string): this;
    dataTableUpsertAttributes(value: DataTableUpsertAttributeGroup[]): this;
    addUpsertAttributeGroup(group: DataTableUpsertAttributeGroup): this;
    upsertAttributeGroup(primaryKeyGroupName: string, primaryValues: DataTablePrimaryValue[], attributes: DataTableUpsertAttributeValue[]): this;
}
