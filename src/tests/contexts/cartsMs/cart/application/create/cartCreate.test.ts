import CartCreate from "../../../../../../contexts/cartsMs/cart/application/create/cartCreate";
import Cart from "../../../../../../contexts/cartsMs/cart/domain/cart";
import CartAlreadyExists from "../../../../../../contexts/cartsMs/cart/domain/cartAlreadyExists";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import CartRepositoryMock from "../../__mocks__/cartRepositoryMock";

describe("CartCreate Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let service: CartCreate;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    service = new CartCreate(cartRepository);
  });
  it("Should rise on Invalid Cart Id", async () => {
    // Given
    // When/Then
    await expect(
      service.run("NonUUID", Uuid.random().toString())
    ).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on cart already exists.", async () => {
    // Given
    const cartIdInUse = Uuid.random().toString();
    const userId = Uuid.random().toString();
    cartRepository.whenCountByIdReturn(new CartCount(1));
    // When/Then
    await expect(service.run(cartIdInUse, userId)).rejects.toThrow(
      CartAlreadyExists
    );
  });

  it("Should create Cart", async () => {
    // Given
    const cartId = Uuid.random();
    const userId = Uuid.random();
    cartRepository.whenCountByIdReturn(new CartCount(0));
    // When
    await service.run(cartId.toString(), userId.toString());
    const lastSavedCart = cartRepository.lastSavedCart();
    // Then
    expect(lastSavedCart).toBeInstanceOf(Cart);
    expect(lastSavedCart.toPrimitives()).toEqual(
      Cart.create(cartId, userId).toPrimitives()
    );
  });
});
