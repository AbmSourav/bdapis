const fs = require('fs');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

function seedDivisionData() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource/v1.1.json'), 'utf8'));
    const result = [];
    const division_name_list = [];

    data.forEach(item => {
        if (division_name_list.length === 0) {
            division_name_list.push(item.division)
            result.push({
                divisionbn: item.divisionBN,
                division: item.division,
                coordinates: item.divisionLatLong
            })

            return;
        }

        if (division_name_list.includes(item.division)) {
            return;
        }

        division_name_list.push(item.division)
        result.push({
            divisionbn: item.divisionBN,
            division: item.division,
            coordinates: item.divisionLatLong
        })
    })

    return result;
}

console.log(seedDivisionData());
exports.seedDivisionData = seedDivisionData;
