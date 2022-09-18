import query from "../../../../shared/domain/queryBus/query";
import QueryHandler from "../../../../shared/domain/queryBus/queryHandler";
import CartItemFindAll from "./cartItemFindAll";
import CartItemFindAllQuery from "./cartItemFindAllQuery";
import CartItemFindAllResponse from "./cartItemFindAllResponse";

export default class CartItemFindAllQueryHandler
  implements QueryHandler<CartItemFindAllQuery, CartItemFindAllResponse>
{
  constructor(private cartItemFindAll: CartItemFindAll) {}

  subscribedTo(): query {
    return CartItemFindAllQuery;
  }

  async handle(query: CartItemFindAllQuery): Promise<CartItemFindAllResponse> {
    return this.cartItemFindAll.run(query.cartId);
  }
}
