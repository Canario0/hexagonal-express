import CartNotFoundError from "../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartItemCreate from "../../../../../../contexts/cartsMs/cartItem/application/create/cartItemCreate";
import CartItem from "../../../../../../contexts/cartsMs/cartItem/domain/cartItem";
import CartItemCount from "../../../../../../contexts/cartsMs/cartItem/domain/valueObject/cartItemCount";
import { Price } from "../../../../../../contexts/cartsMs/cartItem/domain/valueObject/price";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import CartRepositoryMock from "../../../cart/__mocks__/cartRepositoryMock";
import CartItemRepositoryMock from "../../__mocks__/cartItemRepositoryMock";

describe("CartItemCreate Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let cartItemRepository: CartItemRepositoryMock;
  let service: CartItemCreate;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    cartItemRepository = new CartItemRepositoryMock();
    service = new CartItemCreate(cartItemRepository, cartRepository);
  });

  it("Should rise on Invalid Cart Id", async () => {
    // Given
    // When/Then
    await expect(
      service.run("NonUUID", Uuid.random().toString(), 3)
    ).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Invalid Cart Item Id", async () => {
    // Given
    // When/Then
    await expect(
      service.run(Uuid.random().toString(), "NonUUID", 3)
    ).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Invalid Price value", async () => {
    // Given
    // When/Then
    await expect(
      service.run(Uuid.random().toString(), "NonUUID", -1)
    ).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Missing Cart Error", async () => {
    // Given
    const missingCartId = Uuid.random();
    const itemId = Uuid.random();
    const price = 0.1;
    cartRepository.whenCountByIdReturn(new CartCount(0));
    // When/Then
    await expect(
      service.run(missingCartId.toString(), itemId.toString(), price)
    ).rejects.toThrow(CartNotFoundError);
  });

  it("Should create a new item", async () => {
    // Given
    const cartId = Uuid.random();
    const itemId = Uuid.random();
    const price = new Price(0.01);
    cartRepository.whenCountByIdReturn(new CartCount(1));
    cartItemRepository.whenFindByIdReturn(null);
    // When
    await service.run(cartId.toString(), itemId.toString(), price.value);
    const lastSavedCartItem = cartItemRepository.lastSavedCartItem();
    // Then
    expect(lastSavedCartItem).toBeInstanceOf(CartItem);
    expect(lastSavedCartItem.toPrimitives()).toEqual(
      CartItem.create(itemId, price, cartId).toPrimitives()
    );
  });

  it("Should update an already created item", async () => {
    // Given
    const cartId = Uuid.random();
    const itemId = Uuid.random();
    const price = new Price(0.01);
    const dbItem = CartItem.create(itemId, price, cartId);
    cartRepository.whenCountByIdReturn(new CartCount(1));
    cartItemRepository.whenFindByIdReturn(dbItem);
    // When
    await service.run(cartId.toString(), itemId.toString(), price.value);
    const lastSavedCartItem = cartItemRepository.lastSavedCartItem();
    // Then
    expect(lastSavedCartItem).toBeInstanceOf(CartItem);
    expect(lastSavedCartItem.toPrimitives()).toEqual(
      new CartItem(itemId, price, new CartItemCount(2), cartId).toPrimitives()
    );
  });
});

