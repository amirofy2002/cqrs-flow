import { Observable, Subject } from "rxjs";
import { CommandBus } from "./CommandBus";
import { ICommand, IEvent } from "../../core/types";

export class EventBus {
  static subject = new Subject<IEvent>();
  private commandBus = new CommandBus();
  publish(event: IEvent) {
    EventBus.subject.next(event);
  }
  get $subject() {
    return EventBus.subject;
  }

  execute(commands: Observable<ICommand>) {
    commands.subscribe((cmd) => {
      this.commandBus.publish(cmd);
    });
  }
}
