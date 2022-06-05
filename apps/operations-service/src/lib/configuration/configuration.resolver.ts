import { Float, Query, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { Configuration, ConfigurationClientSide } from './models/configuration.model';
import { GqlAuth0Guard } from '@balancer/share-server-common/lib/authentication';
@Resolver((of) => ConfigurationClientSide)
export class ConfigurationResolver {
  private readonly logger = new Logger('ConfigurationResolver');
  constructor(private configurationService: ConfigurationService) {}
  @Query(() => Float)
  uptime() {
    return process.uptime();
  }
  @Query(returns => [ConfigurationClientSide])
  async siteSettings() {
    this.logger.log('request client side configuration')
    return await this.configurationService.fetchClientSideConfigurations();
  }
  @Query(returns => [Configuration])
  @UseGuards(GqlAuth0Guard)
  async platformSettings() {
    this.logger.log('request platform configuration')
    return await this.configurationService.fetchConfigurations();
  }
}
