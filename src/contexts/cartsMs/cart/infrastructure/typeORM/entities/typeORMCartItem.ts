import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import TypeORMCart from "./typeORMCart";

@Entity()
export default class TypeORMCartItem {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  price!: number;

  @Column()
  count!: number;

  @ManyToOne(() => TypeORMCart, (typeORMCart) => typeORMCart.items)
  cart!: TypeORMCart;
}
