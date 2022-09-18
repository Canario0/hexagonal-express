import Query from "./query";
import Response from "./response";

export default interface QueryHandler<Q extends Query, R extends Response> {
  subscribedTo(): Query;
  handle(query: Q): Promise<R>;
}
