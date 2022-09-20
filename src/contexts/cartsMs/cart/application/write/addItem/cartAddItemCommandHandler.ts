import Command from "../../../../../shared/domain/commandBus/command";
import CommandHandler from "../../../../../shared/domain/commandBus/commandHandler";
import CartAddItem from "./cartAddItem";
import CartAddItemCommand from "./cartAddItemCommand";

export default class CartAddItemCommandHandler
  implements CommandHandler<CartAddItemCommand>
{
  public constructor(private cartItemCreate: CartAddItem) {}

  public subscribedTo(): Command {
    return CartAddItemCommand;
  }

  public async handle(command: CartAddItemCommand) {
    await this.cartItemCreate.run(command.cartId, command.productId, command.price);
  }
}
