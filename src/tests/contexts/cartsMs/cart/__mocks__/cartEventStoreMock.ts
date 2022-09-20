import CartId from "../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";
import Cart from "../../../../../contexts/cartsMs/cart/domain/write/cart";
import CartEventStore from "../../../../../contexts/cartsMs/cart/domain/write/cartEventStore";
import DomainEvent from "../../../../../contexts/shared/domain/eventBus/domainEvent";

export default class CartEventStoreMock implements CartEventStore {
  private mockApply = jest.fn();
  private mockLoad = jest.fn();

  public whenLoadReturn(events: Cart | null) {
    this.mockLoad.mockResolvedValue(events);
  }

  public lastSavedEvents(): DomainEvent[] {
    const mock = this.mockApply.mock;
    return mock.calls[mock.calls.length - 1][0] as DomainEvent[];
  }

  public async load(id: CartId): Promise<Cart | null> {
    return this.mockLoad(id);
  }

  public async apply(events: DomainEvent[]): Promise<void> {
    await this.mockApply(events);
  }
}
