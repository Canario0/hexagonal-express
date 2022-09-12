import CartFindById from "../../../../../../contexts/cartsMs/cart/application/findById/cartFindById";
import Cart from "../../../../../../contexts/cartsMs/cart/domain/cart";
import CartItem from "../../../../../../contexts/cartsMs/cart/domain/cartItem";
import CartNotFoundError from "../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartId from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";
import CartItems from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartItems";
import CartValidated from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartValidated";
import UserId from "../../../../../../contexts/cartsMs/cart/domain/valueObject/userId";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import CartRepositoryMock from "../../__mocks__/cartRepositoryMock";

describe("CartFindById Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let service: CartFindById;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    service = new CartFindById(cartRepository);
  });
  it("Should rise on Invalid Cart Id", async () => {
    // Given
    // When/Then
    await expect(service.run("NonUUID")).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on missing Cart Id", async () => {
    // Given
    cartRepository.whenSearchByIdReturn(null);
    const missingId = Uuid.random().toString();
    // When/Then
    await expect(service.run(missingId)).rejects.toThrow(CartNotFoundError);
  });

  it("Should return correct Cart", async () => {
    // Given
    const cartId = CartId.random();
    const userId = UserId.random();
    cartRepository.whenSearchByIdReturn(Cart.create(cartId, userId));
    // When
    const cart = await service.run(cartId.toString());
    // Then
    expect(cartId.equals(cart.id)).toBeTruthy();
    expect(userId.equals(cart.userId)).toBeTruthy();
    expect(CartValidated.initialize().equals(cart.validated)).toBeTruthy();
    expect(CartItems.initialize().equals(cart.items)).toBeTruthy();
  });
});
