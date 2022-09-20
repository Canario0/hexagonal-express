import Command from "../../../../../shared/domain/commandBus/command";

export default class CartAddItemCommand extends Command {
  public readonly productId: string;
  public readonly cartId: string;
  public readonly price: number;

  constructor(cartId: string, productId: string, price: number) {
    super();
    this.productId = productId;
    this.cartId = cartId;
    this.price = price;
  }
}
