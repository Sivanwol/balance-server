import { Injectable } from '@nestjs/common';
import { PrismaService } from '@balancer/share-server-common/prisma.service';
import { Asset } from './models/asset.model';
import { AssetCategory } from './models/asset-category.model';
@Injectable()
export class AssetsService {
  constructor(private prismaService: PrismaService) {}
  public async fetchAssetById(id: string): Promise<Asset> {
    return Asset.toModel(await this.prismaService.assets.findFirst({ where: { id, disabledAt: null } }));
  }

  public async fetchAssetByCategoryId(id: string): Promise<Asset[]> {
    return (
      await this.prismaService.assets.findMany({
        where: {
          disabledAt: null,
          categories: {
            every: {
              categoryId: id,
              category: {
                disabledAt: null,
              },
            },
          },
        },
      })
    ).map((item) => Asset.toModel(item));
  }

  public async fetchAssetCategory(id: string): Promise<AssetCategory> {
    return AssetCategory.toModel(
      await this.prismaService.assetsCategories.findFirst({
        where: { id, disabledAt: null },
      })
    );
  }

  public async hasAsset(id: string): Promise<boolean> {
    const hasEntity = await this.prismaService.assets.findFirst({ where: { id, disabledAt: null } });
    return !!hasEntity;
  }

  public async hasAssetCategory(id: string): Promise<boolean> {
    const hasEntity = await this.prismaService.assetsCategories.findFirst({ where: { id, disabledAt: null } });
    return !!hasEntity;
  }
}
