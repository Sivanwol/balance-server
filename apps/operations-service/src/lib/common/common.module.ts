import { PrismaService , StorageService} from '@applib/share-server-common'
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PrismaService,StorageService],
  exports: [PrismaService,StorageService],
})
export class CommonModule {}
