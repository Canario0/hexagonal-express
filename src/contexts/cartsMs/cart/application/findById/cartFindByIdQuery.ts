import Query from "../../../../shared/domain/queryBus/query";

export default class CartFindByIdQuery extends Query {
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
