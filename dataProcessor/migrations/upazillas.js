const { PrismaClient, Prisma } = require("@prisma/client");
const { parseUpazillaData } = require("../parsers/upazilla");

const prisma = new PrismaClient()

async function main() {
    parseUpazillaData.then(async (data) => {
        await prisma.Upazillas.createMany({
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
