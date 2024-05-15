const { PrismaClient, Prisma } = require("@prisma/client");
const { parseDivisionData } = require("../parsers/division");

const prisma = new PrismaClient()

async function main() {
    await prisma.Divisions.createMany({
        "data": parseDivisionData()
    })
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
