export class InvocationException extends Error {
  constructor(public reason: string) {
    super(reason);
  }
}
