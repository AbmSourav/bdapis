const { PrismaClient } = require("@prisma/client");
const { seedUpazillaData } = require("../seeders/upazilla");

const prisma = new PrismaClient()

async function main() {
    // Check if upazillas already exist
    const existingCount = await prisma.upazillas.count();
    
    if (existingCount > 0) {
        console.log(`Upazillas already exist (${existingCount} records). Skipping migration.`);
        return;
    }
    
    const upazillaData = await seedUpazillaData();
    await prisma.Upazillas.createMany({
        "data": upazillaData
    })
    
    console.log(`Successfully inserted ${upazillaData.length} upazillas.`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
