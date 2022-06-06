import { PrismaClient } from '@prisma/client';

const settings = [
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
    data: settings,
    skipDuplicates: true,
  });
  console.log(`Generate Platform Settings finished.`);
}
