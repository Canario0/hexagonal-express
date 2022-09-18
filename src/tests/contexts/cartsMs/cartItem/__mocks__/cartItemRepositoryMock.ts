import CartId from "../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";
import CartItemView from "../../../../../contexts/cartsMs/cart/domain/read/cartItemView";
import CartItemViewRepository from "../../../../../contexts/cartsMs/cart/domain/read/cartItemViewRepository";
import ProductId from "../../../../../contexts/cartsMs/cart/domain/valueObject/productId";

export default class CartItemRepositoryMock implements CartItemViewRepository {
  private mockFindAll = jest.fn();
  private mockSave = jest.fn();
  private mockFindById = jest.fn();

  public whenFindAllReturn(cartItems: CartItemView[]) {
    this.mockFindAll.mockResolvedValue(cartItems);
  }

  public whenFindByIdReturn(cartItem: CartItemView | null) {
    this.mockFindById.mockResolvedValue(cartItem);
  }

  public lastSavedCartItem(): CartItemView {
    const mock = this.mockSave.mock;
    return mock.calls[mock.calls.length - 1][0] as CartItemView;
  }

  public async findAll(id: CartId): Promise<CartItemView[]> {
    return this.mockFindAll(id);
  }

  public async findById(id: ProductId): Promise<CartItemView | null> {
    return this.mockFindById(id);
  }

  public async save(cartItem: CartItemView): Promise<void> {
    this.mockSave(cartItem);
  }
}
