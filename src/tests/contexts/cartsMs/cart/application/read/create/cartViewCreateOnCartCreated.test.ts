import CartViewCreate from "../../../../../../../contexts/cartsMs/cart/application/read/create/cartViewCreate";
import CartViewCreateOnCartViewCreated from "../../../../../../../contexts/cartsMs/cart/application/read/create/cartViewCreateOnCartCreated";
import CartView from "../../../../../../../contexts/cartsMs/cart/domain/read/cartView";
import CartCount from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartCreatedDomainEvent from "../../../../../../../contexts/cartsMs/cart/domain/write/cartCreatedDomainEvent";
import InvalidArgumentError from "../../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../../contexts/shared/domain/valueObject/uuid";
import CartViewRepositoryMock from "../../../__mocks__/cartViewRepositoryMock";

describe("CartViewCreate Test Suit", () => {
  let cartViewRepository: CartViewRepositoryMock;
  let eventHandler: CartViewCreateOnCartViewCreated;
  beforeAll(() => {
    cartViewRepository = new CartViewRepositoryMock();
    const service = new CartViewCreate(cartViewRepository);
    eventHandler = new CartViewCreateOnCartViewCreated(service);
  });
  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const event = new CartCreatedDomainEvent({
      id: "NonUUID",
      version: 0,
      userId: Uuid.random().toString(),
      validated: false,
    });
    // When/Then
    await expect(eventHandler.on(event)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should not rise on cart already exists.", async () => {
    // Given
    const cartIdInUse = Uuid.random().toString();
    const userId = Uuid.random().toString();
    cartViewRepository.whenCountByIdReturn(new CartCount(1));
    const event = new CartCreatedDomainEvent({
      id: cartIdInUse,
      version: 0,
      userId: userId,
      validated: false,
    });
    // When
    await eventHandler.on(event)
    // Then
  });

  it("Should create Cart", async () => {
    // Given
    const cartId = Uuid.random();
    const userId = Uuid.random();
    cartViewRepository.whenCountByIdReturn(new CartCount(0));
    const event = new CartCreatedDomainEvent({
      id: cartId.toString(),
      version: 0,
      userId: userId.toString(),
      validated: false,
    });
    // When
    await eventHandler.on(event);
    const lastSavedCart = cartViewRepository.lastSavedCart();
    // Then
    expect(lastSavedCart).toBeInstanceOf(CartView);
    expect(lastSavedCart.toPrimitives()).toEqual(
      CartView.create(cartId, userId).toPrimitives()
    );
  });
});
