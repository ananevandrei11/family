import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

export const USER_MOCK_PRISMA: Prisma.UserCreateManyInput[] = [
  {
    fullName: 'devuser',
    email: 'devuser@family.com',
    password: hashSync('user', 10),
    role: 'USER',
  },
  {
    fullName: 'devadmin',
    email: 'devadmin@family.com',
    password: hashSync('admin', 10),
    role: 'ADMIN',
  },
];

export const CATEGORIES_MOCK_PRISMA: Prisma.CategoryCreateManyInput[] = [
  {
    name: 'Cafe',
  },
  {
    name: 'Products',
  },
  {
    name: 'Sport',
  },
  {
    name: 'Health',
  },
  {
    name: 'Hobies',
  },
  {
    name: 'Business',
  },
  {
    name: 'Bad Habits',
  },
];
