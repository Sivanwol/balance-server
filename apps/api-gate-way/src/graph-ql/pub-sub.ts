import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSubRedisOptions } from 'graphql-redis-subscriptions/dist/redis-pubsub';


const options: PubSubRedisOptions = {
  connection: {
    ...{uri: process.env.REDIS_URL},
    retryStrategy: (times: number) => {
      // retry after 10 seconds
      return 10 * 1000;
    },
  },
};

export default new RedisPubSub(options);
