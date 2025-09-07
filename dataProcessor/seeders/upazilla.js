const fs = require('fs');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

function seedUpazillaData() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource/v1.1.json'), 'utf8'));
    
    let districts = prisma.districts.findMany({});

    return districts.then(dists => {
        const result = [];
        const uniqueUpazillas = new Set();
        
        // Create a map for quick district lookup
        const districtMap = {};
        dists.forEach(district => {
            districtMap[district.district] = district.id;
        });

        data.forEach(item => {
            const upazillaKey = `${item.upazilla}-${item.district}`;
            
            // Only add if this upazilla hasn't been added yet
            if (!uniqueUpazillas.has(upazillaKey)) {
                uniqueUpazillas.add(upazillaKey);
                
                // Find the corresponding district_id
                const district_id = districtMap[item.district];

                if (district_id) {
                    // Double check if this exact combination already exists in result
                    const exists = result.find(r => 
                        r.district_id === district_id && r.upazilla === item.upazilla
                    );
                    
                    if (!exists) {
                        result.push({
                            district_id: district_id,
                            upazilla: item.upazilla
                        });
                    }
                }
            }
        });

        console.log(`Total unique upazillas: ${result.length}`);
        return result;
    })
}

exports.seedUpazillaData = seedUpazillaData;
