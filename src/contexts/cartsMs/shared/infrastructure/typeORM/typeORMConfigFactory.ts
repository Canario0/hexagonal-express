import { DataSourceOptions } from "typeorm";
import TypeORMCart from "./entities/typeORMCart";
import TypeORMCartItem from "./entities/typeORMCartItem";

export default class TypeORMConfigFactory {
  static createConfig(): DataSourceOptions {
    return {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "test",
      password: "test",
      database: "cartMs",
      // FIXME: DO NOT LET THIS REACH PRODUCTION is much safer
      // to configure migrations than auto sync which can lead
      // to database corruption
      synchronize: true,
      logging: false,
      entities: [TypeORMCart, TypeORMCartItem],
      migrations: [],
      subscribers: [],
    };
  }
}
