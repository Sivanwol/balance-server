import { PrismaClient, Prisma } from '@prisma/client';
import { generateAssets } from './GenerateAssets';
import { generateAssetCategories } from './GenerateAssetsCategories';
import { generatePlatformSettings } from './GeneratePlatformSettings';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  console.log(`The connection URL is ${process.env.DATABASE_URL}`);

  await generatePlatformSettings(prisma);
  await generateAssets(prisma);
  await generateAssetCategories(prisma);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
