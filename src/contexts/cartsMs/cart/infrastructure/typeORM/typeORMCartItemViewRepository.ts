import _ from "lodash";
import { ObjectType } from "typeorm";
import TypeORMRepositry from "../../../../shared/infrastructure/typeORM/typeORMRepository";
import CartId from "../../domain/valueObject/cartId";
import TypeORMCartItem from "../../../shared/infrastructure/typeORM/entities/typeORMCartItem";
import CartItemView from "../../domain/read/cartItemView";
import CartItemViewRepository from "../../domain/read/cartItemViewRepository";
import ProductId from "../../domain/valueObject/productId";

export default class TypeORMCartItemViewRepository
  extends TypeORMRepositry<TypeORMCartItem>
  implements CartItemViewRepository
{
  protected entity(): ObjectType<TypeORMCartItem> {
    return TypeORMCartItem;
  }

  public async findAll(id: CartId): Promise<CartItemView[]> {
    const cartItemRepository = await this.getRepository();
    const rawCartItems = await cartItemRepository.find({
      where: { cartId: id.toString() },
    });
    return rawCartItems.map(this.toAggregatedRoot);
  }

  public async findById(id: ProductId): Promise<CartItemView | null> {
    const cartItemRepository = await this.getRepository();
    const rawCartItem = await cartItemRepository.findOne({
      where: { productId: id.toString() },
    });
    if (rawCartItem === null) {
      return rawCartItem;
    }
    return this.toAggregatedRoot(rawCartItem);
  }

  public async save(cart: CartItemView): Promise<void> {
    const repository = await this.getRepository();
    const entity = cart.toPrimitives();
    await repository.upsert(entity, {
      conflictPaths: ["productId", "cartId"],
      skipUpdateIfNoValuesChanged: true,
    });
    await this.persist(entity);
  }

  private toAggregatedRoot(rawCartItem: TypeORMCartItem) {
    return CartItemView.fromPrimitives({
      id: rawCartItem.id,
      price: rawCartItem.price,
      count: rawCartItem.count,
      cartId: rawCartItem.cartId,
    });
  }
}
