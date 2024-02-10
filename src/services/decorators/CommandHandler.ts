import { from, tap } from "rxjs";
import { Logger } from "../logger/logger";
import { ICommand, ICommandHandler } from "../../core/types";
import { CommandBus } from "../CommandBus";

export function CommandHandler(command: ICommand) {
  return function <T extends new (...args: any[]) => ICommandHandler<ICommand>>(
    constructor: T
  ) {
    return class extends constructor {
      name = `${command.constructor.name}`;
      ___logger___ = new Logger(this.name);
      $myCommands = new CommandBus()
        .register(this.name, this)
        .pipe(tap((x) => {}))
        .subscribe({
          next: (xCommand) => {
            from(this.execute(xCommand.command)).subscribe({
              next: (x) => {
                xCommand.onSuccess.next(x);
              },
              error: (err) => {
                xCommand.onError.next(err?.message ?? err);
                this.___logger___.error({ err }, `${this.name}:ERROR`);
              },
            });
          },
          error: (err) => this.___logger___.error({ err }),
        });
    };
  };
}
