import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import TypeORMCartItem from "./typeORMCartItem";

@Entity()
export default class TypeORMCart {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column()
  validated!: boolean;

  @OneToMany(() => TypeORMCartItem, (typeORMCartItem) => typeORMCartItem.cart)
  items!: TypeORMCartItem[];
}
