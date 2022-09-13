import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import TypeORMCart from "./typeORMCart";

@Entity()
export default class TypeORMCartItem {
  @PrimaryColumn("uuid")
  id!: string;

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
