import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import TypeORMCart from "./typeORMCart";

@Entity()
@Unique(["productId", "cartId"])
export default class TypeORMCartItem {
  // CAVEAT: one limitation of typeORM is that all entities MUST 
  // have an primary column otherwise it will not work
  @PrimaryGeneratedColumn()
  id!: number;

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
