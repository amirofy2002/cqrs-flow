import { from, tap } from "rxjs";
import { Logger } from "../logger/logger";
import { ICommand, ICommandHandler } from "../../core/types";
import { CommandBus } from "../CommandBus";

export function CommandHandler(command: ICommand) {
  return function <
    T extends { new (...args: any[]): ICommandHandler<ICommand> }
  >(constructor: T) {
    return class extends constructor {
      name = `${command}`.split(" ")[1];
      logger = new Logger(this.name);
      $mycommands = new CommandBus()
        .register(this.name, this)
        .pipe(
          tap((x) =>
            this.logger.log({ name: x.name }, `${this.name}:EXECUTING`)
          )
        )
        .subscribe({
          next: (xCommand) => {
            from(this.execute(xCommand.command)).subscribe({
              next: (x) => {
                xCommand.onSuccess.next(x);
                this.logger.log({ response: x }, `${this.name}:COMPLETED`);
              },

              error: (err) => {
                xCommand.onError.next(err);
                this.logger.error({ err }, `${this.name}:ERROR`);
              },
            });
          },
          error: (err) => this.logger.error({ err }),
        });
    };
  };
}
