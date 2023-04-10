import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany({});
  const posts = [];
  for (let i = 0; i < 100; i++) {
    posts.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      author: faker.name.fullName(),
      authorImage: faker.image.avatar(),
      createdAt: new Date(Date.now() - 1000 * (60 * i)),
    });
  }

  await prisma.post.createMany({
    data: posts,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
