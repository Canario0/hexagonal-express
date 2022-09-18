import DomainEvent from "../../../../shared/domain/eventBus/domainEvent";
import CartId from "../valueObject/cartId";
import Cart from "./cart";

export default interface CartEventStore {
  load(id: CartId): Promise<Cart | null>;
  apply(events: DomainEvent[]): Promise<void>;
}
