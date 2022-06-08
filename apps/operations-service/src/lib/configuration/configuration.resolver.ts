import { Float, Query, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { Configuration, ConfigurationClientSide } from './models/configuration.model';
import { GqlAuth0Guard } from '@applib/share-server-common';
@Resolver((of) => ConfigurationClientSide)
export class ConfigurationResolver {
  private readonly logger = new Logger('ConfigurationResolver');
  constructor(private configurationService: ConfigurationService) {}
  @Query(() => Float, {description: 'test query'})
  uptime() {
    return process.uptime();
  }
  @Query(returns => [ConfigurationClientSide], {description: 'fetch client side configurations'})
  async siteSettings() {
    this.logger.log('request client side configuration')
    return await this.configurationService.fetchClientSideConfigurations();
  }
  @Query(returns => [Configuration], {description: 'fetch platform configurations'})
  @UseGuards(GqlAuth0Guard)
  async platformSettings() {
    this.logger.log('request platform configuration')
    return await this.configurationService.fetchConfigurations();
  }
}
