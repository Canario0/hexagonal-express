import _ from "lodash";
import { ObjectType } from "typeorm";
import TypeORMRepositry from "../../../../shared/infrastructure/typeORM/typeORMRepository";
import CartId from "../../../cart/domain/valueObject/cartId";
import TypeORMCartItem from "../../../shared/infrastructure/typeORM/entities/typeORMCartItem";
import CartItem from "../../domain/cartItem";
import CartItemRepository from "../../domain/cartItemRepository";
import CartItemId from "../../domain/valueObject/cartItemId";

export default class TypeORMCartItemRepository
  extends TypeORMRepositry<TypeORMCartItem>
  implements CartItemRepository
{
  protected entity(): ObjectType<TypeORMCartItem> {
    return TypeORMCartItem;
  }

  public async findAll(id: CartId): Promise<CartItem[]> {
    const cartItemRepository = await this.getRepository();
    const rawCartItems = await cartItemRepository.find({
      where: { cartId: id.toString() },
    });
    return rawCartItems.map(this.toAggregatedRoot);
  }

  public async findById(id: CartItemId): Promise<CartItem | null> {
    const cartItemRepository = await this.getRepository();
    const rawCartItem = await cartItemRepository.findOne({
      where: { id: id.toString() },
    });
    if (rawCartItem === null) {
      return rawCartItem;
    }
    return this.toAggregatedRoot(rawCartItem);
  }

  public async save(cart: CartItem): Promise<void> {
    const entity = cart.toPrimitives();
    await this.persist(entity);
  }

  private toAggregatedRoot(rawCartItem: TypeORMCartItem) {
    return CartItem.fromPrimitives({
      id: rawCartItem.id,
      price: rawCartItem.price,
      count: rawCartItem.count,
      cartId: rawCartItem.cartId,
    });
  }
}
