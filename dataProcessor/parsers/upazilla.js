const fs = require('fs');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

function parseUpazillaData() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource.json'), 'utf8'));
    const result = [];

    let districts = prisma.districts.findMany({});

    return districts.then(dists => {
        data.forEach(item => {
            item.upazilla.forEach(uz => {
                let upazilla = {}
                dists.map(district => {
                    if (district.district === item.district) {
                        upazilla.district_id = district.id;
                    }
                })
                upazilla.upazillabn = uz.split(', ')[1]
                upazilla.upazilla = uz.split(', ')[0]

                result.push(upazilla);
            })
        })

        return result;
    })
}

console.log(parseUpazillaData().then(data => console.log(data)));
exports.parseUpazillaData = parseUpazillaData;
