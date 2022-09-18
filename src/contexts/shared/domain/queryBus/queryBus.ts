import Query from "./query";
import Response from "./response";

export default interface QueryBus {
  ask<R extends Response>(query: Query): Promise<R>;
}
