import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@applib/share-server-common/lib'
import { PlatformServices } from '@prisma/client';
import { AssetsService} from './assets.service';
describe('test AssetsService', () => {
  let prisma: PrismaService;
  let service: AssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsService, PrismaService],
    }).compile();
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<AssetsService>(AssetsService);
  });

});
