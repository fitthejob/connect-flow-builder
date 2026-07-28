import type {
  DataTablePrimaryValue,
  DataTableUpsertAttributeGroup,
  DataTableUpsertAttributeValue,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class UpsertDataTableValuesActionBuilder extends BaseActionBuilder<UpsertDataTableValuesActionBuilder> {
  constructor(id: string) {
    super(id, "UpsertDataTableValues");
    this.setParameter("LockVersion", "LATEST");
    this.setParameter("DataTableUpsertAttributes", []);
  }

  lockVersion(value: string): this {
    return this.setParameter("LockVersion", value);
  }

  latestLockVersion(): this {
    return this.setParameter("LockVersion", "LATEST");
  }

  dataTableId(value: string): this {
    return this.setParameter("DataTableId", value);
  }

  dataTableUpsertAttributes(value: DataTableUpsertAttributeGroup[]): this {
    return this.setParameter("DataTableUpsertAttributes", value);
  }

  addUpsertAttributeGroup(group: DataTableUpsertAttributeGroup): this {
    const groups =
      this.getParameter<DataTableUpsertAttributeGroup[]>("DataTableUpsertAttributes");
    groups.push(group);
    return this;
  }

  upsertAttributeGroup(
    primaryKeyGroupName: string,
    primaryValues: DataTablePrimaryValue[],
    attributes: DataTableUpsertAttributeValue[],
  ): this {
    return this.addUpsertAttributeGroup({
      PrimaryKeyGroupName: primaryKeyGroupName,
      PrimaryValues: primaryValues,
      Attributes: attributes,
    });
  }
}
