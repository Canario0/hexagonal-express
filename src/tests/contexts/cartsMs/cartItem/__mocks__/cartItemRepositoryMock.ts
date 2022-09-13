import CartId from "../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";
import CartItem from "../../../../../contexts/cartsMs/cartItem/domain/cartItem";
import CartItemRepository from "../../../../../contexts/cartsMs/cartItem/domain/cartItemRepository";
import CartItemId from "../../../../../contexts/cartsMs/cartItem/domain/valueObject/cartItemId";

export default class CartItemRepositoryMock implements CartItemRepository {
  private mockFindAll = jest.fn();
  private mockSave = jest.fn();
  private mockFindById = jest.fn();

  public whenFindAllReturn(cartItems: CartItem[]) {
    this.mockFindAll.mockResolvedValue(cartItems);
  }

  public whenFindByIdReturn(cartItem: CartItem | null) {
    this.mockFindById.mockResolvedValue(cartItem);
  }

  public lastSavedCartItem(): CartItem {
    const mock = this.mockSave.mock;
    return mock.calls[mock.calls.length - 1][0] as CartItem;
  }

  public async findAll(id: CartId): Promise<CartItem[]> {
    return this.mockFindAll(id);
  }

  public async findById(id: CartItemId): Promise<CartItem | null> {
    return this.mockFindById(id);
  }

  public async save(cartItem: CartItem): Promise<void> {
    this.mockSave(cartItem);
  }
}
