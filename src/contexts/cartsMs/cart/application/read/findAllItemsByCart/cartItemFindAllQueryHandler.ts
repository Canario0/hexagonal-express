import Query from "../../../../../shared/domain/queryBus/query";
import QueryHandler from "../../../../../shared/domain/queryBus/queryHandler";
import CartItemViewFindAll from "./cartItemFindAll";
import CartItemFindAllQuery from "./cartItemFindAllQuery";
import CartItemFindAllResponse from "./cartItemFindAllResponse";

export default class CartItemFindAllQueryHandler
  implements QueryHandler<CartItemFindAllQuery, CartItemFindAllResponse>
{
  constructor(private cartItemFindAll: CartItemViewFindAll) {}

  subscribedTo(): Query {
    return CartItemFindAllQuery;
  }

  async handle(query: CartItemFindAllQuery): Promise<CartItemFindAllResponse> {
    return this.cartItemFindAll.run(query.cartId);
  }
}
