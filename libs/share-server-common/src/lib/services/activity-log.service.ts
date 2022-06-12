import { Injectable } from '@nestjs/common';
import { PrismaService } from '.';

export enum ActivityTypes {
  uploadAsset = 2000,
  removeAsset = 2001,
}
@Injectable()
export class ActivityLogService {
  constructor(private prismaService: PrismaService) {}
  public async registerActivity(userId: string, entityId: string, referalIp: string, activityType: ActivityTypes, message: string, metaData: object) {
    await this.prismaService.activityLog.create({
      data: {
        userId,
        entityId,
        action: activityType,
        referalIp,
        message,
        metaData,
      },
    });
  }
}
