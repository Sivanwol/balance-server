import { PrismaService } from '@applib/share-server-common'
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
