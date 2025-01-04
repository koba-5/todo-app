export default class NullPointerError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
  }
}
