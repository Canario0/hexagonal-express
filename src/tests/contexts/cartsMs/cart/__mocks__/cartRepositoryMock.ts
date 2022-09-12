import Cart from "../../../../../contexts/cartsMs/cart/domain/cart";
import CartRepository from "../../../../../contexts/cartsMs/cart/domain/cartRepository";
import cartId from "../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";

export default class CartRepositoryMock implements CartRepository {
  private mockSearchById = jest.fn();

  public whenSearchByIdReturn(cart: Cart | null) {
    this.mockSearchById.mockResolvedValue(cart);
  }

  public async findById(id: cartId): Promise<Cart | null> {
    return this.mockSearchById(id);
  }
}
