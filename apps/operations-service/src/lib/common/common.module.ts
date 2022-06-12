import { PrismaService, StorageService, DoSpacesServiceProvider, ActivityLogService } from '@applib/share-server-common';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PrismaService, ActivityLogService, DoSpacesServiceProvider, StorageService],
  exports: [PrismaService, ActivityLogService, StorageService],
})
export class CommonModule {}
