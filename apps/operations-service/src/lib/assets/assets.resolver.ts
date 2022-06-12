import { Args, Float, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { GqlAuth0Guard, EntityNotFoundException, PermissionsGuard, Permissions, CurrentUserGQL, RequesterIp } from '@applib/share-server-common';
import { Asset } from './models/asset.model';
import { GraphQLVoid } from 'graphql-scalars';
import { IpwareIpInfo } from '@fullerstack/nax-ipware';
@UseGuards(GqlAuth0Guard, PermissionsGuard)
@Resolver((of) => Asset)
export class AssetsResolver {
  private readonly logger = new Logger('AssetsResolver');
  constructor(private assetsService: AssetsService) {}
  @Query(() => GraphQLVoid, { description: 'test query' })
  testAsset(@CurrentUserGQL() user: any) {
    console.log(user);
    // return process.uptime();
    return;
  }
  @Query(() => Asset, { description: 'get asset by id', nullable: true })
  async getAsset(@Args('id', { type: () => String }) id: string) {
    this.logger.log(`request asset by id => ${id}`);
    if (!(await this.assetsService.hasAsset(id))) throw new EntityNotFoundException();
    return await this.assetsService.fetchAssetById(id);
  }
  @Query(() => [Asset], { description: 'get asset by category id with sorted assets', nullable: true })
  async getAssetsByCategory(@Args('category_id', { type: () => String }) category_id: string) {
    this.logger.log(`request asset by category id => ${category_id}`);
    if (!(await this.assetsService.hasAssetCategory(category_id))) throw new EntityNotFoundException();
    return await this.assetsService.fetchAssetByCategoryId(category_id);
  }

  @Permissions('users:rc:admin')
  @Mutation(() => GraphQLVoid, { description: 'get asset by id', nullable: true })
  async disableAsset(@CurrentUserGQL() user: any, @RequesterIp() requesterIp: IpwareIpInfo, @Args('asset_id', { type: () => String }) asset_id: string) {
    this.logger.log(`request remove of asset by asset id => ${asset_id}`);
    if (!(await this.assetsService.hasAsset(asset_id))) throw new EntityNotFoundException();
    return await this.assetsService.disableAsset(user, requesterIp.ip, asset_id);
  }

  @Permissions('users:rc:admin')
  @Mutation(() => GraphQLVoid, { description: 'get asset by id', nullable: true })
  async deleteAsset(@CurrentUserGQL() user: any, @RequesterIp() requesterIp: IpwareIpInfo, @Args('asset_id', { type: () => String }) asset_id: string) {
    this.logger.log(`request remove of asset by asset id => ${asset_id}`);
    if (!(await this.assetsService.hasAsset(asset_id))) throw new EntityNotFoundException();
    return await this.assetsService.deleteAsset(user, requesterIp.ip, asset_id);
  }
}
