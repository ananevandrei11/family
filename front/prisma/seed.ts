import { CATEGORIES_MOCK_PRISMA, USER_MOCK_PRISMA } from './constants-mock';
import { prisma } from './prisma-client';

async function clearMockData() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Expense" RESTART IDENTITY CASCADE`;
}

async function generateMockData() {
  await prisma.user.createMany({
    data: USER_MOCK_PRISMA,
  });

  await prisma.category.createMany({
    data: CATEGORIES_MOCK_PRISMA,
  });
}

async function main() {
  try {
    await clearMockData();
    await generateMockData();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
