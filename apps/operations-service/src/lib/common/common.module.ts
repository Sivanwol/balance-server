import { PrismaService } from '@balancer/share-server-common/lib/services/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
