import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from '@wolberg-pro-games/utils-server/utils/prisma'

jest.mock('@wolberg-pro-games/utils-server/utils/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
