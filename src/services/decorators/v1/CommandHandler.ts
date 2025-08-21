import { catchError, from, of, tap, EMPTY } from "rxjs";
import { Logger } from "../../logger/logger";
import { ICommand, ICommandHandler } from "../../../core/types";
import { CommandBus } from "../../v1/CommandBus";
import { EventBus } from "../../v1/EventBus";
import { ExecutionFailedEvent } from "../../../core/events/execution-failed.event";
type handleError = {
  handleError?: boolean;
};

export function CommandHandler(command: ICommand, options?: handleError) {
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
            this.execute(xCommand.command)
              .then((res) => {
                xCommand.onSuccess.next(res);
              })
              .catch((err) => {
                if (options?.handleError) {
                  new EventBus().publish(
                    new ExecutionFailedEvent(
                      "command.failed",
                      err.message,
                      xCommand.command
                    )
                  );
                } else {
                  xCommand.onError.next(err);
                }
              });
          },
          error: (err) => this.___logger___.error({ err }),
        });
    };
  };
}
