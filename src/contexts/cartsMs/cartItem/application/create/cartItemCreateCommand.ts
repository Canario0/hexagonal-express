import Command from "../../../../shared/domain/commandBus/command";

export default class CartItemCreateCommand extends Command {
  public readonly id: string;
  public readonly cartId: string;
  public readonly price: number;

  constructor(cartId: string, id: string, price: number) {
    super();
    this.id = id;
    this.cartId = cartId;
    this.price = price;
  }
}
