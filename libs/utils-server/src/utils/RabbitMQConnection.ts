/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import amqp, { Channel, Connection } from 'amqplib'
import { Message, Options } from 'amqplib/properties';
import { find } from 'lodash';
import moment from 'moment';
import { BaseEvent } from '../events/BaseEvent';
import { PingMessage } from '../events/utils/ping';
import { logger } from './logger';
import { knownServices, SharedServicesEvents } from '../constraints/knownservices';

interface ValidateService {
  serviceName: string
  totalServices: number
}

export class RabbitMQConnection {
  private readonly validateServices: ValidateService[] = [];
  private serverServiceName: string;
  private connection: Connection;
  private channel: Channel;
  private static instance: RabbitMQConnection;
  public RegisterEventsList: BaseEvent[] = []

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {

    for (const serviceName of knownServices) {
      this.validateServices.push({
        serviceName,
        totalServices: 0
      })
    }
  }

  public async LoadEvents() {
    for (const event of this.RegisterEventsList) {
      await event.Load();
    }
  }

  public FormatLogMessage(message: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ip = require('ip');
    return `MicroService ${process.env.MICROSERVICE_Name}:${ip.address()} - ${message}`
  }

  public markCurrentService() {
    const locateService = find(this.validateServices, { serviceName: process.env.MICROSERVICE_Group })
    if (!locateService) throw new Error(`unknown service ${process.env.MICROSERVICE_Group}`)
    locateService.totalServices++;
  }

  public HasAllServicesLoaded() {
    const locateService = find(this.validateServices, { totalServices: 0 })
    return !locateService;

  }

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  public async OpenConnection() {
    try {
      const serviceName = knownServices.find(service => service === process.env.MICROSERVICE_Group)
      if (!serviceName) throw new Error('Unknown service group')
      this.serverServiceName = serviceName;
      logger.info("Rabbit Mq Server", process.env.MICROSERVICE_MSG_BROKER)
      // @ts-ignore
      this.connection = await amqp.connect(process.env.MICROSERVICE_MSG_BROKER)
      this.channel = await this.connection.createChannel()
      // @ts-ignore
      await this.channel.assertExchange(process.env.MICROSERVICE_MSG_WORKER_EXCHANGE, 'direct', { durable: true });
      await this.AssertQueues()
    } catch (e) {
      logger.warn('Rabbit MQ Handle Failed System Shot down ...')
      logger.error(e)
      throw new Error('Rabbit MQ Failed , ' + e.message);
    }
  }

  public async AssertQueues() {
    for (const knownServicesEvent of SharedServicesEvents) {
      const queueName = this.formatQueueName(knownServicesEvent)
      // await this.channel.bindQueue( queueName, process.env.MICROSERVICE_MSG_WORKER_EXCHANGE, '' )
      await this.channel.assertQueue(queueName)
    }
  }

  public Ack(message: Message, allUpTo?: boolean) {
    this.channel.ack(message, allUpTo)
  }

  public async Consume(queueName: string, callback: Function, fromService?: string, options?: Options.Consume) {
    if (this.connection && this.channel) {
      const queueFormattedName = this.formatQueueName(queueName, fromService)
      await this.channel.consume(queueFormattedName, (message) => callback(message), options)
    }
  }

  public SendValidateCheckOnServers() {
    for (const serviceName of knownServices) {
      if (serviceName !== process.env.MICROSERVICE_Name) {
        const pingMessage: PingMessage = {
          fromService: serviceName,
          content: 'ping'
        }
        this.SendToQueue(this.formatQueueName('ping', serviceName), Buffer.from(JSON.stringify(pingMessage)))
      }
    }
  }

  public SendToQueue(queueName: string, buffer: Buffer, fromService?: string, options?: Options.Publish) {
    const logMessage = RabbitMQConnection.getInstance().FormatLogMessage(JSON.stringify({
      sendCommand: queueName,
      timestamp: moment().unix()
    }))
    logger.info(logMessage)
    return this.channel.sendToQueue(this.formatQueueName(queueName, fromService), buffer, options)
  }


  public async CloseConnection() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  private formatQueueName(queueName: string, fromService?: string) {
    // @ts-ignore
    return process.env.MICROSERVICE_MSG_QUE_NAME_FORMAT
      .replace('##DestSericeGroupName##', (fromService) ? fromService : this.serverServiceName)
      .replace('##EventName##', queueName);
  }

}
