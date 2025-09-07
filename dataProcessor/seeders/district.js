const fs = require('fs');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

function seedDistrictData() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource/v1.1.json'), 'utf8'));
    
    const divisions = prisma.divisions.findMany({});

    return divisions.then(allDivisions => {
        const result = [];
        const uniqueDistricts = new Set();
        
        // Create a map for quick division lookup
        const divisionMap = {};
        allDivisions.forEach(division => {
            divisionMap[division.division] = division.id;
        });

        data.forEach(item => {
            const districtKey = `${item.district}-${item.division}`;
            
            // Only add if this district hasn't been added yet
            if (!uniqueDistricts.has(districtKey)) {
                uniqueDistricts.add(districtKey);
                
                // Find the corresponding division_id
                const division_id = divisionMap[item.division];
                
                if (division_id) {
                    result.push({
                        division_id: division_id,
                        districtbn: item.districtBN,
                        district: item.district,
                        coordinates: item.districtLatLong
                    });
                }
            }
        });

        return result;
    })
}

exports.seedDistrictData = seedDistrictData;
