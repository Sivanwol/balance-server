import { PrismaClient } from '@prisma/client';

const entities = [
  {
    name: 'category 1',
    description: 'Category 1 description',
    sortBy: 0,
  },
  {
    name: 'category 2',
    description: 'Category 2 description',
    sortBy: 2,
  },
  {
    name: 'category 3',
    description: 'Category 3 description',
    sortBy: 1,
  },
];
export async function generateAssetCategories(prisma: PrismaClient) {
  console.log(`Generate Asset Categories seeding ...`);
  const images = await prisma.assets.findMany({
    select: {
      id: true,
    },
  });
  const users = await prisma.user.findMany({
    select: { id: true },
  });
  let idx = 0;
  for (let entity of entities) {
    entity = {
      ...entity,
      ...{
        assets: {
          create: [
            {
              assetId: images[idx].id,
              assignedById: users[0].id,
            },
          ],
        },
      },
    };
    console.log(entity);
    await prisma.assetsCategories.create({
      data: entity,
    });
  }
  console.log(`Generate finished.`);
}
