import { BaseEvent, BaseMessage } from '../BaseEvent';
import { Message } from 'amqplib/properties';
import { ConfigPayloadFormatException } from '../../exceptions/ConfigPayloadFormatException';
import { ConfigurationMessage } from '../../interfaces/IConfiguration';
import { ConfigService } from '../../services/config.service';
import { Container } from 'typedi';

export const SyncConfigQueueName = "sync_config"

export class SyncConfigEvent extends BaseEvent {
  private configService: ConfigService;

  public constructor() {
    super( SyncConfigQueueName )
    this.configService = Container.get( ConfigService )
  }

  protected async handleEvent( message: Message ) {
    const {content} = message;
    try {
      const payload = JSON.parse( content.toString() ) as ConfigurationMessage[]
      await this.configService.SetServiceSettings( payload )
    } catch (e) {
      throw new ConfigPayloadFormatException( content.toString() )
    }
  }
}
