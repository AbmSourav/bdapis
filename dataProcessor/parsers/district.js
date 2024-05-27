const fs = require('fs');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

function parseDistrictData() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource.json'), 'utf8'));
    const result = [];

    const divisions = prisma.divisions.findMany({});

    return divisions.then(allDivisions => {
        data.forEach(item => {
            allDivisions.map(division => {
                if (division.division == item.division) {
                    result.push({
                        division_id: division.id,
                        districtbn: item.districtbn,
                        district: item.district,
                        coordinates: item.dislatlong
                    })
                }
            })
        })

        return result;
    })
}

exports.parseDistrictData = parseDistrictData;
