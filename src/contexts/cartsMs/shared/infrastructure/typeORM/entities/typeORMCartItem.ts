import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import TypeORMCart from "./typeORMCart";

@Entity()
@Unique(["productId", "cartId"])
export default class TypeORMCartItem {
  @Column("uuid")
  productId!: string;

  @Column("float")
  price!: number;

  @Column()
  count!: number;

  @Column()
  cartId!: string;

  @ManyToOne(() => TypeORMCart, (typeORMCart) => typeORMCart.items)
  @JoinColumn({ name: "cartId" })
  cart!: TypeORMCart;
}
