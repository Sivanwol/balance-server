import { Injectable } from '@nestjs/common';
import { EntityNotFoundException, PrismaService, StorageService } from '@applib/share-server-common';
import { Asset } from './models/asset.model';
import { AssetCategory } from './models/asset-category.model';
import { UploadNewAssetArgs } from './inputs/upload-new-asset.input';
import moment from 'moment'
@Injectable()
export class AssetsService {
  constructor(private prismaService: PrismaService, private storageService:StorageService) {}
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
  public async uploadNewAsset(userId: string, data: UploadNewAssetArgs){
    const record = await this.prismaService.assetsCategories.findFirst({where: {id: data.categoryId}})
    if (record) {
      // try {
      //   this.storageService.uploadFile(data.bucket, userId)
      // }
      await this.prismaService.assetsCategories.update({
        where: {id: data.categoryId},
        data: {
          assets: {
            create: {
              assignedById: userId,
              assignedAt: moment().toDate(),
              asset: {
                create: {
                  fileName: data.fileName,
                  path: data.path,
                  bucket: data.bucket,
                  publicUrl: data.publicUrl,
                  sortBy: data.sortBy,
                  metaData: data.metaData,
                }
              }
            }
          }
        }
      })
    } else {
      throw new EntityNotFoundException()
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
}
