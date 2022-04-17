import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from '@balancer/utils-server/utils/prisma'

jest.mock('@balancer/utils-server/utils/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
