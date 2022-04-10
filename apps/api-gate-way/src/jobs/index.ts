import * as dotenv from 'dotenv';
import { SyncConfigQueue } from './queues/syncConfig.queue';
import RedisUtil from '@wolberg-pro-games/utils-server/utils/redisUtil';
dotenv.config();
const syncConfigQueue = SyncConfigQueue(RedisUtil.client)
export const queueKeys = {
  sync: syncConfigQueue.queueName
}
export const queues = {
  [queueKeys.sync]: {
    queue: syncConfigQueue.queue,
    scheduler: syncConfigQueue.scheduler
  }
}

function initializeOnStartWorkersQueue() {
  if (!queues[queueKeys.sync].scheduler.isRunning())
    queues[queueKeys.sync].queue.add(queueKeys.sync, {}, {
      attempts: 3,
      priority: 1,
      repeat: {
        cron: '* 0 0 * * *',
      },
    }
    );
}
initializeOnStartWorkersQueue();
