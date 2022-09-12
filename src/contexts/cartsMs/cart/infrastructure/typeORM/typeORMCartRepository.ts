import { ObjectType } from "typeorm";
import TypeORMRepositry from "../../../../shared/infrastructure/typeORM/typeORMRepository";
import Cart from "../../domain/cart";
import CartRepository from "../../domain/cartRepository";
import cartId from "../../domain/valueObject/cartId";
import TypeORMCart from "./entities/typeORMCart";

export default class TypeORMCartRepository
  extends TypeORMRepositry<TypeORMCart>
  implements CartRepository
{
  protected entity(): ObjectType<TypeORMCart> {
    return TypeORMCart;
  }

  public async findById(id: cartId): Promise<Cart | null> {
    const cartRepository = await this.getRepository();
    const rawCart = await cartRepository.findOne({
      where: { id: id.toString() },
      relations: {
        items: true,
      },
    });
    if (rawCart === null) {
      return rawCart;
    }
    return this.toAggregatedRoot(rawCart);
  }

  private toAggregatedRoot(rawCart: TypeORMCart) {
    return Cart.fromPrimitives({
      id: rawCart.id,
      userId: rawCart.userId,
      validated: rawCart.validated,
      items: rawCart.items,
    });
  }
}
