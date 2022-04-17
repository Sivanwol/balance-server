import { Worker, Job } from 'bullmq';
import { queueName } from '../queues/syncConfig.queue'
import { Redis } from 'ioredis';
import RedisUtil from '@balancer/utils-server/utils/redisUtil';
import { logger } from '@balancer/utils-server/utils/logger';
import { RabbitMQConnection } from '@balancer/utils-server/utils/RabbitMQConnection';
import { PlatformSettingsService } from '../../services';

export const syncConfigWorker = (redisConnection: Redis) => new Worker(queueName, async (job: Job) => {
  const jobInfo = job.asJSON()
  const platformSettingsService = new PlatformSettingsService
  const settings = await platformSettingsService.GetGlobalSettings()
  logger.info(`[JobId:${jobInfo.id} ,Timestamp: ${jobInfo.timestamp}] Sync new configs ${settings.length} keys`)
  RabbitMQConnection.getInstance().SendToQueue('syncConfig', Buffer.from(JSON.stringify(settings)))
  await RedisUtil.client.del('require_services_sync')
  logger.info(`[JobId:${jobInfo.id} ,Timestamp: ${jobInfo.timestamp}] Sent to all micro services on queue 'syncConfig'`)
}, {
  prefix: '(config)',
  connection: redisConnection,
  concurrency: 1,
  runRetryDelay: 30000,
  settings: {
    backoffStrategies: {
      custom(attemptsMade: number) {
        return attemptsMade * 10000;
      },
    },
  },
  limiter: {
    max: 1,
    duration: 1000
  }
});
