import Command from "./command";

export default interface CommandBus {
  dispatch(command: Command): Promise<void>;
}
