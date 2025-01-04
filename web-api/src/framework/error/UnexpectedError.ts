export default class Unexpected extends Error {
  constructor({ message }: { message: string }) {
    super(message);
  }
}
