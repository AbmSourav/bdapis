const { PrismaClient, Prisma } = require("@prisma/client");
const { parseDistrictData } = require("../parsers/district");

const prisma = new PrismaClient()

async function main() {
    parseDistrictData.then(async (data) => {
        await prisma.Districts.createMany({
            "data": data
        })
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
