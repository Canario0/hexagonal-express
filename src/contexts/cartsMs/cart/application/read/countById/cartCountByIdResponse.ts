import Response from "../../../../../shared/domain/queryBus/response";
import CartCount from "../../../domain/valueObject/cartCount";

export default class CartCountByIdResponse implements Response {
  public readonly count: CartCount;

  constructor(count: CartCount) {
    this.count = count;
  }
}
