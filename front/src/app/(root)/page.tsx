import { prisma } from '../../../prisma/prisma-client';

export default async function Home() {
  const users = await prisma.user.findMany();
  console.log('users', users);
  return (
    <div>
      <h1>MAIN PAGE!. Next JS in Docker.</h1>
    </div>
  );
}
