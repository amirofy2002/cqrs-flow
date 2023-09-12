export class Logger {
  constructor(private readonly name: string) {}

  log(...args: any[]): void {
    throw new Error("Method not implemented.");
  }
  error(...args: any[]): void {
    throw new Error("Method not implemented.");
  }
}
