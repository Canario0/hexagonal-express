import CartView from "../../../../../contexts/cartsMs/cart/domain/read/cartView";
import CartRepository from "../../../../../contexts/cartsMs/cart/domain/cartRepository";
import CartCount from "../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import cartId from "../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";

export default class CartRepositoryMock implements CartRepository {
  private mockSearchById = jest.fn();
  private mockCountById = jest.fn();
  private mockSave = jest.fn();

  public whenSearchByIdReturn(cart: CartView | null) {
    this.mockSearchById.mockResolvedValue(cart);
  }

  public whenCountByIdReturn(count: CartCount) {
    this.mockCountById.mockResolvedValue(count);
  }

  public lastSavedCart(): CartView {
    const mock = this.mockSave.mock;
    return mock.calls[mock.calls.length - 1][0] as CartView;
  }

  public async findById(id: cartId): Promise<CartView | null> {
    return this.mockSearchById(id);
  }

  public async countById(id: cartId): Promise<CartCount> {
    return this.mockCountById(id);
  }

  public async save(cart: CartView): Promise<void> {
    this.mockSave(cart);
  }
}
