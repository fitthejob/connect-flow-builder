import { BaseActionBuilder } from "../common.js";
export class EvaluateDataTableValuesActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "EvaluateDataTableValues");
        this.setParameter("Queries", []);
    }
    dataTableId(value) {
        return this.setParameter("DataTableId", value);
    }
    queries(value) {
        return this.setParameter("Queries", value);
    }
    addQuery(query) {
        const queries = this.getParameter("Queries");
        queries.push(query);
        return this;
    }
    query(queryName, attributes, primaryValues) {
        return this.addQuery({
            QueryName: queryName,
            Attributes: attributes,
            PrimaryValues: primaryValues,
        });
    }
}
