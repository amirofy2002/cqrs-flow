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
      ___logger___ = new Logger(this.name);
      $mycommands = new CommandBus()
        .register(this.name, this)
        .pipe(
          tap((x) =>
            this.___logger___.log({ name: x.name }, `${this.name}:EXECUTING`)
          )
        )
        .subscribe({
          next: (xCommand) => {
            from(this.execute(xCommand.command)).subscribe({
              next: (x) => {
                xCommand.onSuccess.next(x);
                this.___logger___.log(
                  { response: x },
                  `${this.name}:COMPLETED`
                );
              },

              error: (err) => {
                xCommand.onError.next(err);
                this.___logger___.error({ err }, `${this.name}:ERROR`);
              },
            });
          },
          error: (err) => this.___logger___.error({ err }),
        });
    };
  };
}
