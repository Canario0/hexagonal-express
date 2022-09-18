export default class EventSourcingSubscriberNotRegistered extends Error {
  constructor(key: string) {
    super(`Internal error: the event sourcing subscriber <${key}> not found`);
  }
}
