import { Message } from 'amqplib/properties';
import { RabbitMQConnection } from '../utils/RabbitMQConnection';

export interface BaseMessage {
  fromService: string
}

export abstract class BaseEvent {
  private readonly eventName: string
  private readonly fromService: string

  protected constructor(eventName: string, fromService?: string) {
    this.eventName = eventName.toLowerCase();
    this.fromService = fromService?.toLowerCase()
  }

  public async Load() {
    await this.wiredEvent(this.fromService)
  }

  public getEventName() {
    return this.eventName
  }
  protected abstract handleEvent(message: Message)

  private async wiredEvent(fromService?: string) {
    await RabbitMQConnection.getInstance().Consume(this.eventName, this.handleEvent.bind(this), fromService, { noAck: false })
  }
}
