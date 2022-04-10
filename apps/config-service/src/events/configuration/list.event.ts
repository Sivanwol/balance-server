import { Message } from 'amqplib/properties';
import { BaseEvent } from '@wolberg-pro-games/utils-server/events/BaseEvent';

export class ListEvent extends BaseEvent {
  constructor() {
    super('ConfigList');
  }
  protected handleEvent(message: Message) { }

}
