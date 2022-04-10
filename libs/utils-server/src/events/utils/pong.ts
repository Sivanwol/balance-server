import { Message } from 'amqplib/properties';
import { logger } from '../../utils/logger';
import { BaseEvent } from '../BaseEvent';
import { RabbitMQConnection } from '../../utils/RabbitMQConnection';

export class PongEvent extends BaseEvent {
  public constructor() {
    super('Pong')
  }
  protected handleEvent(dataMessage: Message) {
    const msg = dataMessage.content.toString();
    const arr = msg.split(':');
    const fromService = arr[0];
    const timestamp = dataMessage.properties.timestamp;
    const logMessage = RabbitMQConnection.getInstance().FormatLogMessage(JSON.stringify({
      receivedFrom: fromService,
      command: 'Ping',
      response: 'Pong',
      timestamp
    }))
    logger.info(logMessage)
    RabbitMQConnection.getInstance().markCurrentService()
    RabbitMQConnection.getInstance().Ack(dataMessage, true);
  }
}
