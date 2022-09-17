import { ContainerBuilder, Definition } from "node-dependency-injection";
import DomainEvent from "../../domain/eventBus/domainEvent";
import DomainEventSubscriber from "../../domain/eventBus/domainEventSubscriber";

export const from = (
  container: ContainerBuilder
): DomainEventSubscriber<DomainEvent>[] => {
  const subscriberDefinitions = container.findTaggedServiceIds(
    "domainEventSubscriber"
  ) as Map<String, Definition>;

  const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];
  subscriberDefinitions.forEach((_: Definition, key: String) => {
    const domainEventSubscriber = container.get<
      DomainEventSubscriber<DomainEvent>
    >(key.toString());
    subscribers.push(domainEventSubscriber);
  });
  return subscribers;
};
