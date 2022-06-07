import { PrismaClient } from '@prisma/client';

const entities = [
  {
    key: 'maintenance_mode',
    value: {
      operations: false,
    },
    isEnabled: true,
  },
];

export async function generatePlatformSettings(prisma: PrismaClient) {
  console.log(`Generate Platform Settings seeding ...`);
  await prisma.platformSettings.createMany({
    data: entities,
    skipDuplicates: true,
  });
  console.log(`Generate finished.`);
}
