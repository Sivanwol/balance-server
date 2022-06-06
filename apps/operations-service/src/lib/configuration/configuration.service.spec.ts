import { ConfigurationService } from './configuration.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@balancer/share-server-common/prisma.service';
import { PlatformServices } from '@prisma/client';

describe('test ConfigurationService', () => {
  let prisma: PrismaService;
  let service: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigurationService, PrismaService],
    }).compile();
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<ConfigurationService>(ConfigurationService);
  });
  it('should be getting only client side configs', async () => {
    prisma.platformSettings.findMany = jest.fn().mockReturnValueOnce([
      { key: 'test', service: PlatformServices.operations, value: {}, isClientSide: true, isEnabled: true },
      { key: 'test1', service: PlatformServices.operations, value: {}, isClientSide: true, isEnabled: false },
      { key: 'test2', service: PlatformServices.operations, value: {}, isClientSide: true, isEnabled: true },
      { key: 'test', service: PlatformServices.operations, value: {}, isClientSide: false, isEnabled: true },
    ]);
    const res = await service.fetchClientSideConfigurations();
    expect(res).toBeDefined();
    expect(res.length).toBe(2);
    expect(res[0].key).toBe('test')
  });
});
