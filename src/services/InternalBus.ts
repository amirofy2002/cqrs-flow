import { Subject } from "rxjs";
import { ISystemEvent } from "../core/types/ISystemEvent";

export class InternalBus {
  static subject = new Subject<ISystemEvent>();
  publish(event: ISystemEvent) {
    InternalBus.subject.next(event);
  }
  get $subject() {
    return InternalBus.subject;
  }
}
