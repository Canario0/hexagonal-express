import CartAddItemView from "../../../../../../../contexts/cartsMs/cart/application/read/addItem/cartAddItemView";
import CartAddItemViewOnCartItemAdded from "../../../../../../../contexts/cartsMs/cart/application/read/addItem/cartAddItemViewOnCartItemAdded";
import CartItemView from "../../../../../../../contexts/cartsMs/cart/domain/read/cartItemView";
import Price from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/price";
import CartItemAddedDomainEvent from "../../../../../../../contexts/cartsMs/cart/domain/write/cartItemAddedDomainEvent";
import InvalidArgumentError from "../../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../../contexts/shared/domain/valueObject/uuid";
import CartItemViewRepositoryMock from "../../../__mocks__/cartItemViewRepositoryMock";

describe("CartAddItemView Test Suit", () => {
  let cartItemViewRepository: CartItemViewRepositoryMock;
  let eventHandler: CartAddItemViewOnCartItemAdded;
  beforeAll(() => {
    cartItemViewRepository = new CartItemViewRepositoryMock();
    const service = new CartAddItemView(cartItemViewRepository);
    eventHandler = new CartAddItemViewOnCartItemAdded(service);
  });

  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const event = new CartItemAddedDomainEvent({
      id: "NonUUID",
      version: 1,
      price: 3,
      productId: Uuid.random().toString(),
    });
    // When/Then
    await expect(eventHandler.on(event)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Invalid Cart Item Id", async () => {
    // Given
    const event = new CartItemAddedDomainEvent({
      id: Uuid.random().toString(),
      version: 1,
      price: 3,
      productId: "NonUUID",
    });
    // When/Then
    await expect(eventHandler.on(event)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Invalid Price value", async () => {
    // Given
    cartItemViewRepository.whenFindByProductAndCartReturn(null);
    const event = new CartItemAddedDomainEvent({
      id: Uuid.random().toString(),
      version: 1,
      price: -3,
      productId: Uuid.random().toString(),
    });
    // When/Then
    await expect(eventHandler.on(event)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should create a new item", async () => {
    // Given
    const cartId = Uuid.random();
    const productId = Uuid.random();
    const price = new Price(0.01);
    cartItemViewRepository.whenFindByProductAndCartReturn(null);
    const event = new CartItemAddedDomainEvent({
      id: cartId.toString(),
      version: 1,
      price: price.value,
      productId: productId.toString(),
    });
    // When
    await eventHandler.on(event);
    const lastSavedCartItem = cartItemViewRepository.lastSavedCartItem();
    // Then
    expect(lastSavedCartItem).toBeInstanceOf(CartItemView);
    expect(lastSavedCartItem.toPrimitives()).toEqual(
      CartItemView.create(productId, price, cartId).toPrimitives()
    );
  });

  it("Should update an already created item", async () => {
    // Given
    const cartId = Uuid.random();
    const productId = Uuid.random();
    const price = new Price(0.01);
    const dbCart = CartItemView.create(productId, price, cartId);
    cartItemViewRepository.whenFindByProductAndCartReturn(dbCart);
    const event = new CartItemAddedDomainEvent({
      id: cartId.toString(),
      version: 1,
      price: price.value,
      productId: productId.toString(),
    });
    // When
    await eventHandler.on(event);
    const lastSavedCartItem = cartItemViewRepository.lastSavedCartItem();
    // Then
    const expectedCartItem = CartItemView.create(productId, price, cartId);
    expectedCartItem.incrementCount();
    expect(lastSavedCartItem).toBeInstanceOf(CartItemView);
    expect(lastSavedCartItem.toPrimitives()).toEqual(
      expectedCartItem.toPrimitives()
    );
  });
});
