import { Injectable, Logger } from '@nestjs/common';
import { ActivityLogService, ActivityTypes, EntityNotFoundException, PrismaService, StorageService } from '@applib/share-server-common';
import { Asset } from './models/asset.model';
import { AssetCategory } from './models/asset-category.model';
import { UploadNewAssetArgs } from './inputs/upload-new-asset.input';
import moment from 'moment';
@Injectable()
export class AssetsService {
  private readonly logger = new Logger('AssetsService');
  constructor(private prismaService: PrismaService, private activityLogService: ActivityLogService, private storageService: StorageService) {}
  public async fetchAssetById(id: string): Promise<Asset> {
    return Asset.toModel(await this.prismaService.assets.findFirst({ where: { id, disabledAt: null } }));
  }

  public async fetchAssetByCategoryId(id: string): Promise<Asset[]> {
    return (
      (
        await this.prismaService.assets.findMany({
          where: {
            disabledAt: null,
            NOT: {
              publishAt: null,
            },
            categories: {
              some: {
                categoryId: id,
                category: {
                  disabledAt: null,
                  NOT: {
                    publishAt: null,
                  },
                  id,
                },
              },
            },
          },
          orderBy: {
            sortBy: 'desc',
          },
        })
      ).map((item) => Asset.toModel(item)) || []
    );
  }

  public async fetchAssetCategory(id: string): Promise<AssetCategory> {
    return AssetCategory.toModel(
      await this.prismaService.assetsCategories.findFirst({
        where: {
          id,
          disabledAt: null,
          NOT: {
            publishAt: null,
          },
          assets: {
            some: {
              categoryId: id,
              category: {
                disabledAt: null,
                NOT: {
                  publishAt: null,
                },
                id,
              },
            },
          },
        },
        include: { assets: true },
      })
    );
  }

  public async getCategories(): Promise<AssetCategory[]> {
    return (
      (
        await this.prismaService.assetsCategories.findMany({
          where: {
            disabledAt: null,
            NOT: {
              publishAt: null,
            },
            assets: {
              some: {
                category: {
                  disabledAt: null,
                  NOT: {
                    publishAt: null,
                  },
                },
              },
            },
          },
          include: { assets: true },
          orderBy: {
            sortBy: 'desc',
          },
        })
      ).map((item) => AssetCategory.toModel(item)) || []
    );
  }

  public async disableAsset(userId: string, ip: string, assetId: string) {
    const record = await this.prismaService.assets.findFirst({ where: { id: assetId } });
    if (record) {
      await this.prismaService.assets.update({
        where: { id: assetId },
        data: {
          disabledAt: moment().utc().toDate(),
        },
      });
      await this.activityLogService.registerActivity(userId, record.id, ip, ActivityTypes.uploadAsset, `user id ${userId} has disable asset ${assetId}`, {
        userId,
        record,
      });
    }
  }
  public async deleteAsset(userId: string, ip: string, assetId: string) {
    const record = await this.prismaService.assets.findFirst({ where: { id: assetId } });
    if (record) {
      await this.activityLogService.registerActivity(userId, record.id, ip, ActivityTypes.uploadAsset, `user id ${userId} has delete asset ${assetId}`, {
        userId,
        record,
      });
      try {
        this.storageService.removeFile(record.bucket, record.path, record.fileName);
      } catch (e) {
        this.logger.error(e);
      }
      await this.prismaService.assets.delete({
        where: { id: assetId },
      });
    }
  }

  public async uploadNewAsset(userId: string, ip: string, data: UploadNewAssetArgs) {
    const record = await this.prismaService.assetsCategories.findFirst({ where: { id: data.categoryId } });
    if (record) {
      const path = `assets/${data.entityId}`;
      await this.storageService.moveFileFromUploads(data.bucket, path, data.fileName);
      // try {
      //   this.storageService.uploadFile(data.bucket, userId)
      // }
      await this.prismaService.assetsCategories.update({
        where: { id: data.categoryId },
        data: {
          assets: {
            create: {
              assignedById: userId,
              assignedAt: moment().toDate(),
              asset: {
                create: {
                  fileName: `${userId}-${data.fileName}`,
                  path,
                  bucket: data.bucket,
                  entityId: data.entityId,
                  publicUrl: data.publicUrl,
                  sortBy: data.sortBy,
                  metaData: data.metaData,
                },
              },
            },
          },
        },
      });
      await this.activityLogService.registerActivity(userId, data.categoryId, ip, ActivityTypes.uploadAsset, `user id ${userId} has upload new asset`, {
        userId,
        entityId: data.entityId,
        categoryId: data.categoryId,
      });
    } else {
      throw new EntityNotFoundException();
    }
  }

  public async hasAsset(id: string): Promise<boolean> {
    const hasEntity = await this.prismaService.assets.findFirst({ where: { id, disabledAt: null } });
    return !!hasEntity;
  }

  public async hasAssetCategory(id: string): Promise<boolean> {
    const hasEntity = await this.prismaService.assetsCategories.findFirst({ where: { id, disabledAt: null } });
    return !!hasEntity;
  }
  public async hasAssetCategoryHasAnyAssets(id: string): Promise<boolean> {
    const record = await this.prismaService.assets.count({
      where: {
        NOT: {
          publishAt: null,
        },
        disabledAt: null,
        categories: {
          some: {
            category: {
              NOT: {
                publishAt: null,
              },
              disabledAt: null,
            },
            categoryId: id,
          },
        },
      },
    });
    return record > 0;
  }
}
