import { ObjectType } from "typeorm";
import TypeORMRepositry from "../../../../shared/infrastructure/typeORM/typeORMRepository";
import Cart from "../../domain/cart";
import CartRepository from "../../domain/cartRepository";
import CartCount from "../../domain/valueObject/cartCount";
import CartId from "../../domain/valueObject/cartId";
import _ from "lodash";
import TypeORMCart from "../../../shared/infrastructure/typeORM/entities/typeORMCart";

export default class TypeORMCartRepository
  extends TypeORMRepositry<TypeORMCart>
  implements CartRepository
{
  protected entity(): ObjectType<TypeORMCart> {
    return TypeORMCart;
  }

  public async findById(id: CartId): Promise<Cart | null> {
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

  public async countById(id: CartId): Promise<CartCount> {
    const cartRepository = await this.getRepository();
    const rawCount = await cartRepository.countBy({ id: id.toString() });
    return new CartCount(rawCount);
  }

  public async save(cart: Cart): Promise<void> {
    const entity = _.omit(cart.toPrimitives(), ["items"]);
    await this.persist(entity);
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
