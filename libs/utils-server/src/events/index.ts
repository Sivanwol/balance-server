import { BaseEvent } from './BaseEvent';
import { ServicesRoute } from '../constraints/knownservices';
import { PingEvent } from './utils/ping';
import { PongEvent } from './utils/pong';
import { SyncConfigEvent } from './configuration/syncConfig';

export abstract class SharedEvents {
  protected eventNameList: BaseEvent[] = []
  protected constructor() {
    this.eventNameList.push((new PingEvent))
    this.eventNameList.push((new PongEvent))
    if (process.env.MICROSERVICE_Group !== ServicesRoute.ConfigService) {
      this.eventNameList.push((new SyncConfigEvent))
    }
    this.loadEvents();
    // here we will handle case by case for now this a template
    // switch (process.env.MICROSERVICE_Group) {
    //   case ServicesRoute.APIGateWay: {
    //   }
    // }
  }
  protected abstract loadEvents();
  public getEventList(): BaseEvent[] {
    return this.eventNameList
  }
}
