import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { Configuration, ConfigurationClientSide } from './models/configuration.model';
import { GqlAuth0Guard } from '@balancer/share-server-common/lib/authentication';
@Resolver((of) => Configuration)
export class ConfigurationResolver {
  constructor(private configurationService: ConfigurationService) {}

  @Query(() => ConfigurationClientSide)
  async siteSettings() {
    return await this.configurationService.fetchClientSideConfigurations();
  }
  @Query(() => ConfigurationClientSide)
  @UseGuards(GqlAuth0Guard)
  async platformSettings() {
    return await this.configurationService.fetchClientSideConfigurations();
  }
}
