import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GqlAuth0Guard } from './gql-auth0.guard';
import { GqlAuth0ModuleAsyncOptions, GqlAuth0ModuleOptions, GqlAuth0OptionsFactory } from './interfaces';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthenticationModule {

  static forRoot(options: GqlAuth0ModuleOptions): DynamicModule {
    return {
      module: AuthenticationModule,
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        JwtStrategy,
        {
          provide: 'GRAPHQL_AUTH0_MODULE_OPTIONS',
          useValue: options,
        },
        GqlAuth0Guard
      ],
      exports: [GqlAuth0Guard]
    }
  }

  static forRootAsync(options: GqlAuth0ModuleAsyncOptions): DynamicModule {
    return {
      module: AuthenticationModule,
      imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ...(options.imports || [])],
      providers: [
        JwtStrategy,
        ...this.createAsyncProviders(options),
      ],
    };
  }

  private static createAsyncProviders(
    options: GqlAuth0ModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass as Type<GqlAuth0OptionsFactory>,
        useClass: options.useClass as Type<GqlAuth0OptionsFactory>,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: GqlAuth0ModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: 'GRAPHQL_AUTH0_MODULE_OPTIONS',
        useFactory: options.useFactory,
        // useFactory: async (...args: any[]) =>
        //   await options.useFactory(...args),
        inject: options.inject || [],
      };
    }
    return {
      provide: 'GRAPHQL_AUTH0_MODULE_OPTIONS',
      useFactory: async (optionsFactory: GqlAuth0OptionsFactory) =>
        await optionsFactory.createGqlAuth0Options(),
      inject: [(options.useClass || options.useExisting) as Type<GqlAuth0OptionsFactory>],
    };
  }
}
