import { PrismaService, StorageService, DoSpacesServiceProvider } from '@applib/share-server-common';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PrismaService, DoSpacesServiceProvider, StorageService],
  exports: [PrismaService, StorageService],
})
export class CommonModule {}
