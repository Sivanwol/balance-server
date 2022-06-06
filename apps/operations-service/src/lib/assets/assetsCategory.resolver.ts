import { Args, Float, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { GqlAuth0Guard } from '@balancer/share-server-common/lib/authentication';
import { AssetCategory } from './models/asset-category.model';

@UseGuards(GqlAuth0Guard)
@Resolver((of) => AssetCategory)
export class AssetsCategoryResolver {
  private readonly logger = new Logger('ConfigurationResolver');
  constructor(private assetsService: AssetsService) {}
  @Query(() => Float, {description: 'test query'})
  uptime() {
    return process.uptime();
  }
  @Query(() => AssetCategory, {description: 'get category', nullable: true})
  async getCategory(@Args('id', { type: () => String } ) id: string) {
    this.logger.log(`request asset category by id => ${id}`)
    if (!await this.assetsService.hasAssetCategory(id)) return null;
    return await this.assetsService.fetchAssetByCategoryId(id);

  }

  @ResolveField('assets')
  async assets(@Parent() category) {
    const { id } = category;
    return await this.assetsService.fetchAssetByCategoryId(id);
  }
}
