import { AuthenticationModule } from '@balancer/share-server-common/lib/authentication';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { ClientOpts } from 'redis';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync<ClientOpts>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL')|| 10,
        store: redisStore,
        url: configService.get('REDIS_URL')
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: '../schema.gql',
      debug: process.env.NODE_ENV === 'development',
      playground: process.env.NODE_ENV === 'development',
      installSubscriptionHandlers: true,
      include: [AuthenticationModule],
      context: ({ req, res, payload, connection }) => ({ req, res, payload, connection }),
      // configure graphql cors here
      path: 'gql/secure',
    }),
    ConfigurationModule
  ],
})
export class AppModule {}
