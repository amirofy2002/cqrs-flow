import { catchError, from, tap } from "rxjs";
import { Logger } from "../logger/logger";
import { ICommand, ICommandHandler } from "../../core/types";
import { CommandBus } from "../CommandBus";
type handleError = {
  handleError?: boolean;
};

export function CommandHandler(
  command: ICommand,
  { handleError = true }: handleError
) {
  return function <
    T extends { new (...args: any[]): ICommandHandler<ICommand> }
  >(constructor: T) {
    return class extends constructor {
      name = `${command}`.split(" ")[1];
      ___logger___ = new Logger(this.name);
      $myCommands = new CommandBus()
        .register(this.name, this)
        .pipe(tap((x) => {}))
        .subscribe({
          next: (xCommand) => {
            from(this.execute(xCommand.command))
              .pipe(
                catchError((err, caught) => {
                  xCommand.onError.next(err?.message ?? err);
                  return handleError ? from([]) : caught;
                })
              )
              .subscribe({
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
