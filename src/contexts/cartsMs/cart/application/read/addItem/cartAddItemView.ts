import CartItemView from "../../../domain/read/cartItemView";
import CartItemViewRepository from "../../../domain/read/cartItemViewRepository";
import CartId from "../../../domain/valueObject/cartId";
import Price from "../../../domain/valueObject/price";
import ProductId from "../../../domain/valueObject/productId";

export default class CartAddItemView {
  constructor(private cartItemViewRepository: CartItemViewRepository) {}

  async run(cartItemPrimitive: {
    cartId: string;
    productId: string;
    price: number;
  }) {
    const cartId = new CartId(cartItemPrimitive.cartId);
    const productId = new ProductId(cartItemPrimitive.productId);
    let cartItem = await this.cartItemViewRepository.findByProductAndCart(
      productId,
      cartId
    );

    if (cartItem === null) {
      cartItem = CartItemView.create(
        productId,
        new Price(cartItemPrimitive.price),
        cartId
      );
    } else {
      cartItem.incrementCount();
    }

    await this.cartItemViewRepository.save(cartItem);
  }
}
