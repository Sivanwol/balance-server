import { Args, Float, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CurrentUserGQL, EntityNotFoundException, GqlAuth0Guard, PermissionsGuard, RequesterIp } from '@applib/share-server-common';
import { AssetCategory } from './models/asset-category.model';
import { Asset } from './models/asset.model';
import { UploadNewAssetArgs } from './inputs/upload-new-asset.input';
import { AssetCategoryHasNoAssetsException } from './exceptions/asset-category-has-no-assets.exception';
import { GraphQLVoid } from 'graphql-scalars';
import { IpwareIpInfo } from '@fullerstack/nax-ipware';
import { BoundAssetToCategoryArgs } from './inputs/bound-asset-to-category.input';

@UseGuards(GqlAuth0Guard, PermissionsGuard)
@Resolver((of) => AssetCategory)
export class AssetsCategoryResolver {
  private readonly logger = new Logger('ConfigurationResolver');
  constructor(private assetsService: AssetsService) {}
  @Query(() => Float, { description: 'test query' })
  uptime() {
    return process.uptime();
  }
  @Query(() => AssetCategory, { description: 'get category (assets if request will not for sort)', nullable: true })
  async getCategory(@Args('id', { type: () => String }) id: string) {
    this.logger.log(`request asset category by id => ${id}`);
    if (!(await this.assetsService.hasAssetCategory(id))) throw new EntityNotFoundException();
    return await this.assetsService.fetchAssetCategory(id);
  }

  @Query(() => [AssetCategory], { description: 'get categories (assets if request will not for sort)', nullable: true })
  async getCategories() {
    this.logger.log(`request asset categories`);
    return await this.assetsService.getCategories();
  }

  @Mutation(() => GraphQLVoid, { description: 'bind and unbind assets to asset category' })
  async boundOrUnboundAssetToCategory(
    @CurrentUserGQL() user: any,
    @RequesterIp() requesterIp: IpwareIpInfo,
    @Args('requestData', { type: () => BoundAssetToCategoryArgs }) requestData: BoundAssetToCategoryArgs
  ) {
    return null;
  }

  @Mutation(() => Asset, { description: 'upload asset the actual upload the client have directly' })
  async uploadNewAsset(@Args('uploadArgs') args: UploadNewAssetArgs) {
    if (!(await this.assetsService.hasAssetCategory(args.categoryId))) throw new EntityNotFoundException();
  }

  @Mutation(() => Asset, { description: 'remove asset from category' })
  async deleteAssets(@Args('assetCategoryId') assetCategoryId: string) {
    if (!(await this.assetsService.hasAssetCategory(assetCategoryId))) throw new EntityNotFoundException();
    if (await this.assetsService.hasAssetCategoryHasAnyAssets(assetCategoryId)) throw new AssetCategoryHasNoAssetsException(assetCategoryId);
  }

  @ResolveField('assets')
  async assets(@Parent() category) {
    const { id } = category;
    return await this.assetsService.fetchAssetByCategoryId(id);
  }
}
