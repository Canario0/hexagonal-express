import CartCreate from "../../../../../../contexts/cartsMs/cart/application/create/cartCreate";
import Cart from "../../../../../../contexts/cartsMs/cart/domain/cart";
import CartAlreadyExists from "../../../../../../contexts/cartsMs/cart/domain/cartAlreadyExists";
import CartCreatedDomainEvent from "../../../../../../contexts/cartsMs/cart/domain/cartCreatedDomainEvent";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import EventBusMock from "../../../shared/__mocks__/eventBusMock";
import CartRepositoryMock from "../../__mocks__/cartRepositoryMock";

describe("CartCreate Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let eventBus: EventBusMock;
  let service: CartCreate;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    eventBus = new EventBusMock();
    service = new CartCreate(cartRepository, eventBus);
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
    const publishedEvents = eventBus.lastPublishedEvents();
    expect(publishedEvents).toHaveLength(1);
    const createEvent = publishedEvents[0] as CartCreatedDomainEvent;
    expect(createEvent.aggregateId).toEqual(cartId.toString());
    expect(createEvent.userId).toEqual(userId.toString());
    expect(createEvent.validated).toBeFalsy();
  });
});
