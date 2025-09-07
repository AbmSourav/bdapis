const { PrismaClient } = require("@prisma/client");
const { seedDivisionData } = require("../seeders/division");

// console.log("seedDivisionData", seedDivisionData());
const prisma = new PrismaClient()

async function main() {
    // Check if divisions already exist
    const existingCount = await prisma.divisions.count();
    
    if (existingCount > 0) {
        console.log(`Divisions already exist (${existingCount} records). Skipping migration.`);
        return;
    }
    
    const divisionData = seedDivisionData();
    await prisma.Divisions.createMany({
        "data": divisionData
    })
    
    console.log(`Successfully inserted ${divisionData.length} divisions.`);
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
