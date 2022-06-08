import { Args, Float, Query, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { GqlAuth0Guard, EntityNotFoundException } from '@balancer/share-server-common/lib';
import { Asset } from './models/asset.model';


@UseGuards(GqlAuth0Guard)
@Resolver((of) => Asset)
export class AssetsResolver {
  private readonly logger = new Logger('AssetsResolver');
  constructor(private assetsService: AssetsService) {}
  @Query(() => Float, {description: 'test query'})
  uptime() {
    return process.uptime();
  }
  @Query(() => Asset, {description: 'get asset by id', nullable: true})
  async getAsset(@Args('id', { type: () => String } ) id: string) {
    this.logger.log(`request asset by id => ${id}`)
    if (!await this.assetsService.hasAsset(id)) throw new EntityNotFoundException();
    return await this.assetsService.fetchAssetById(id)
  }
  @Query(() => [Asset], {description: 'get asset by category id', nullable: true})
  async getAssetsByCategory(@Args('category_id', { type: () => String }) category_id: string) {
    this.logger.log(`request asset by category id => ${category_id}`)
    if (!await this.assetsService.hasAssetCategory(category_id)) throw new EntityNotFoundException();
    return await this.assetsService.fetchAssetByCategoryId(category_id);
  }
}
