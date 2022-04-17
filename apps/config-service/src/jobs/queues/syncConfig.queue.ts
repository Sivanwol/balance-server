import { Redis } from 'ioredis';
import { Queue, QueueScheduler } from 'bullmq';
import { syncConfigWorker } from '../workers/syncConfig.worker';
import { IQueue } from '@balancer/utils-server/interfaces/IQueue';
export const queueName = 'configSync'

export const SyncConfigQueue = (redisConnection: Redis): IQueue => ({
  queueName,
  queue: new Queue(queueName, { connection: redisConnection }),
  scheduler: new QueueScheduler(queueName),
  worker: syncConfigWorker(redisConnection)
})
