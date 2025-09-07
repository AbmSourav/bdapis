const { PrismaClient } = require("@prisma/client");
const { seedDistrictData } = require("../seeders/district");

const prisma = new PrismaClient()

async function main() {
    // Check if districts already exist
    const existingCount = await prisma.districts.count();
    
    if (existingCount > 0) {
        console.log(`Districts already exist (${existingCount} records). Skipping migration.`);
        return;
    }
    
    const districtData = await seedDistrictData();
    await prisma.Districts.createMany({
        "data": districtData
    })
    
    console.log(`Successfully inserted ${districtData.length} districts.`);
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
