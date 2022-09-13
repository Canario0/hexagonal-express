import CartNotFoundError from "../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartItemFindAll from "../../../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAll";
import CartItem from "../../../../../../contexts/cartsMs/cartItem/domain/cartItem";
import CartItemCount from "../../../../../../contexts/cartsMs/cartItem/domain/valueObject/cartItemCount";
import { Price } from "../../../../../../contexts/cartsMs/cartItem/domain/valueObject/price";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import CartRepositoryMock from "../../../cart/__mocks__/cartRepositoryMock";
import CartItemRepositoryMock from "../../__mocks__/cartItemRepositoryMock";

describe("CartItemFindAll Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let cartItemRepository: CartItemRepositoryMock;
  let service: CartItemFindAll;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    cartItemRepository = new CartItemRepositoryMock();
    service = new CartItemFindAll(cartItemRepository, cartRepository);
  });

  it("Should rise on Invalid Cart Id", async () => {
    // Given
    // When/Then
    await expect(service.run("NonUUID")).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Missing Cart Error", async () => {
    // Given
    const missingCartId = Uuid.random();
    cartRepository.whenCountByIdReturn(new CartCount(0));
    // When/Then
    await expect(service.run(missingCartId.toString())).rejects.toThrow(
      CartNotFoundError
    );
  });

  it("Should return a list of cart items.", async () => {
    // Given
    const validCartId = Uuid.random();
    cartRepository.whenCountByIdReturn(new CartCount(1));
    const item1 = new CartItem(
      Uuid.random(),
      new Price(3),
      new CartItemCount(2),
      validCartId
    );
    const item2 = new CartItem(
      Uuid.random(),
      new Price(0.5),
      new CartItemCount(4),
      validCartId
    );
    cartItemRepository.whenFindAllReturn([item1, item2]);
    // When
    const cartItems = await service.run(validCartId.toString());
    // Then
    expect(cartItems).toHaveLength(2);
    expect(item1.toPrimitives()).toEqual(cartItems[0].toPrimitives());
    expect(item2.toPrimitives()).toEqual(cartItems[1].toPrimitives());
  });
});
