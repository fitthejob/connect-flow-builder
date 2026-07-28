import type {
  EvaluateDataTablePrimaryValue,
  EvaluateDataTableQuery,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class EvaluateDataTableValuesActionBuilder extends BaseActionBuilder<EvaluateDataTableValuesActionBuilder> {
  constructor(id: string) {
    super(id, "EvaluateDataTableValues");
    this.setParameter("Queries", []);
  }

  dataTableId(value: string): this {
    return this.setParameter("DataTableId", value);
  }

  queries(value: EvaluateDataTableQuery[]): this {
    return this.setParameter("Queries", value);
  }

  addQuery(query: EvaluateDataTableQuery): this {
    const queries =
      this.getParameter<EvaluateDataTableQuery[]>("Queries");
    queries.push(query);
    return this;
  }

  query(
    queryName: string,
    attributes: string[],
    primaryValues: EvaluateDataTablePrimaryValue[],
  ): this {
    return this.addQuery({
      QueryName: queryName,
      Attributes: attributes,
      PrimaryValues: primaryValues,
    });
  }
}
