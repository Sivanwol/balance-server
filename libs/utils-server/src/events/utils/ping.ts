import { Message } from 'amqplib/properties';
import { BaseEvent, BaseMessage } from '../BaseEvent';
import { RabbitMQConnection } from '../../utils/RabbitMQConnection';

export interface PingMessage extends BaseMessage {
  content: string
}

export class PingEvent extends BaseEvent {
  public constructor() {
    super('Ping')
  }

  protected handleEvent(dataMessage: Message) {
    const msg = JSON.parse(dataMessage.content.toString()) as PingMessage;

    if (msg.content === 'ping') {
      RabbitMQConnection.getInstance().SendToQueue(
        "Pong",
        Buffer.from(`${process.env.MICROSERVICE_Name}:ok`),
        msg.fromService
      )
      RabbitMQConnection.getInstance().Ack(dataMessage, true);
    }
  }
}
