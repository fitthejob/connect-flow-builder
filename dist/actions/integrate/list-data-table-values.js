import { BaseActionBuilder } from "../common.js";
export class ListDataTableValuesActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "ListDataTableValues");
        this.setParameter("PrimaryKeyGroups", []);
    }
    dataTableId(value) {
        return this.setParameter("DataTableId", value);
    }
    primaryKeyGroups(value) {
        return this.setParameter("PrimaryKeyGroups", value);
    }
    addPrimaryKeyGroup(group) {
        const groups = this.getParameter("PrimaryKeyGroups");
        groups.push(group);
        return this;
    }
    primaryKeyGroup(primaryKeyGroupName, primaryValues) {
        return this.addPrimaryKeyGroup({
            PrimaryKeyGroupName: primaryKeyGroupName,
            PrimaryValues: primaryValues,
        });
    }
}
