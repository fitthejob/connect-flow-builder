import type { DataTablePrimaryKeyGroup, DataTablePrimaryValue } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class ListDataTableValuesActionBuilder extends BaseActionBuilder<ListDataTableValuesActionBuilder> {
  constructor(id: string) {
    super(id, "ListDataTableValues");
    this.setParameter("PrimaryKeyGroups", []);
  }

  dataTableId(value: string): this {
    return this.setParameter("DataTableId", value);
  }

  primaryKeyGroups(value: DataTablePrimaryKeyGroup[]): this {
    return this.setParameter("PrimaryKeyGroups", value);
  }

  addPrimaryKeyGroup(group: DataTablePrimaryKeyGroup): this {
    const groups =
      this.getParameter<DataTablePrimaryKeyGroup[]>("PrimaryKeyGroups");
    groups.push(group);
    return this;
  }

  primaryKeyGroup(
    primaryKeyGroupName: string,
    primaryValues: DataTablePrimaryValue[],
  ): this {
    return this.addPrimaryKeyGroup({
      PrimaryKeyGroupName: primaryKeyGroupName,
      PrimaryValues: primaryValues,
    });
  }
}
