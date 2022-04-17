import { Message } from 'amqplib/properties';
import { BaseEvent } from '@balancer/utils-server/events/BaseEvent';

export class ListEvent extends BaseEvent {
  constructor() {
    super('ConfigList');
  }
  protected handleEvent(message: Message) { }

}
