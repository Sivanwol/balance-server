import { Worker, Queue, QueueScheduler } from 'bullmq';

export interface IQueue {
  queueName: string,
  queue: Queue,
  scheduler: QueueScheduler,
  worker: Worker
}
