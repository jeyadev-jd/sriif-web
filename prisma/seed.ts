// Loads the demo data into an empty database: npx prisma db seed
import "dotenv/config";
import { seed } from "../src/lib/seed";
import { EMPTY, persist } from "../src/server/data";
import { prisma } from "../src/server/prisma";

async function main() {
  if (await prisma.user.count()) {
    console.log("Database already has data; seed skipped. Run `npx prisma migrate reset` to start over.");
    return;
  }
  await persist({ ...EMPTY, cms: {} as typeof EMPTY.cms, facilities: [] }, seed);
  console.log(`Seeded ${seed.users.length} users and ${seed.startups.length} startups.`);
}
main().finally(() => prisma.$disconnect());
