import { Args, Float, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { EntityNotFoundException, GqlAuth0Guard } from '@applib/share-server-common';
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
  @Query(() => AssetCategory, {description: 'get category (assets if request will not for sort)', nullable: true})
  async getCategory(@Args('id', { type: () => String } ) id: string) {
    this.logger.log(`request asset category by id => ${id}`)
    if (!await this.assetsService.hasAssetCategory(id))  throw new EntityNotFoundException();
    return await this.assetsService.fetchAssetCategory(id);

  }

  @Query(() => [AssetCategory], {description: 'get categories (assets if request will not for sort)', nullable: true})
  async getCategories() {
    this.logger.log(`request asset categories`)
    return await this.assetsService.getCategories();
  }

  @ResolveField('assets')
  async assets(@Parent() category) {
    const { id } = category;
    return await this.assetsService.fetchAssetByCategoryId(id);
  }
}
