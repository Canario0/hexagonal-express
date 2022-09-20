import Query from "../../../../../shared/domain/queryBus/query";

export default class CartCountByIdQuery extends Query {
  public readonly cartId: string;

  constructor(cartId: string) {
    super();
    this.cartId = cartId;
  }
}
