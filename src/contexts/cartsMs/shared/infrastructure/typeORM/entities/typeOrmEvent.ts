import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique(["aggregateId", "aggregateVersion"])
export default class TypeORMDomainEvent {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("uuid")
  aggregateId!: string;

  @Column()
  aggregateVersion!: number;

  @Column()
  occurredOn!: Date;

  @Column("json")
  body!: Object;
}
