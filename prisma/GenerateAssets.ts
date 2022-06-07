import { PrismaClient } from '@prisma/client';

const entities = [
  {
    fileName: 'file001',
    path: '/',
    bucket: 'cdn.com',
    publicUrl: 'http://www.walla.co.il',
    sortBy: 0,
    metaData: {},
  },

  {
    fileName: 'file002',
    path: '/',
    bucket: 'cdn.com',
    publicUrl: 'http://www.walla.co.il',
    sortBy: 2,
    metaData: {},
  },
  {
    fileName: 'file003',
    path: '/',
    bucket: 'cdn.com',
    publicUrl: 'http://www.walla.co.il',
    sortBy: 3,
    metaData: {},
  },
  {
    fileName: 'file021',
    path: '/',
    bucket: 'cdn.com',
    publicUrl: 'http://www.walla.co.il',
    sortBy: 0,
    metaData: {},
  },

  {
    fileName: 'file022',
    path: '/',
    bucket: 'cdn.com',
    publicUrl: 'http://www.walla.co.il',
    sortBy: 2,
    metaData: {},
  },
];
export async function generateAssets(prisma: PrismaClient) {
  console.log(`Generate Asset seeding ...`);
  for (const entity of entities) {
    await prisma.assets.create({
      data: entity,
    });
  }
  console.log(`Generate finished.`);
}
