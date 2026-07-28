import { BaseActionBuilder } from "../common.js";
export class UpsertDataTableValuesActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpsertDataTableValues");
        this.setParameter("LockVersion", "LATEST");
        this.setParameter("DataTableUpsertAttributes", []);
    }
    lockVersion(value) {
        return this.setParameter("LockVersion", value);
    }
    latestLockVersion() {
        return this.setParameter("LockVersion", "LATEST");
    }
    dataTableId(value) {
        return this.setParameter("DataTableId", value);
    }
    dataTableUpsertAttributes(value) {
        return this.setParameter("DataTableUpsertAttributes", value);
    }
    addUpsertAttributeGroup(group) {
        const groups = this.getParameter("DataTableUpsertAttributes");
        groups.push(group);
        return this;
    }
    upsertAttributeGroup(primaryKeyGroupName, primaryValues, attributes) {
        return this.addUpsertAttributeGroup({
            PrimaryKeyGroupName: primaryKeyGroupName,
            PrimaryValues: primaryValues,
            Attributes: attributes,
        });
    }
}
