export class Logger {
  constructor(private readonly name: string) {}

  log(...args: any[]): void {
    console.log(args);
  }
  error(...args: any[]): void {
    console.error(args);
  }
}
