const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// params first letter upperCase
const paramsCase = (param) => {
    return param.toLowerCase().replace(/^\w/, firstChr => firstChr.toUpperCase());
}

// print json data or error on the endpoint
const printData = (res, apiData) => {
	let dateTime = new Date();
	dateTime = dateTime.toGMTString('en-US', { timeZone: 'Asia/Dhaka' });

    try {
        res.json({ status: {
            code: 200,
            message: "ok",
            date: dateTime,
            notice: "v1.0 is depricated, please use v1.2. v1.0 will be removed soon."
        }, data: apiData });
    } catch (err) {
        res.send(err);
    }
}

/**
 * all divisions. 
 * 
 * division: string, divisionbn: string
 */
const allDivisions = async (req, res) => {
    const data = await prisma.divisions.findMany({
        select: {
            division: true,
            divisionbn: true
        },
        orderBy: {
            division: 'asc'
        }
    });

    printData(res, data);
}

/**
 * all districts. 
 * 
 * district: string, districtbn: string
 */
const allDistricts = async (req, res) => {
    const data = await prisma.districts.findMany({
        select: {
            district: true,
            districtbn: true
        },
        orderBy: {
            district: 'asc'
        }
    });

    printData(res, data);
}

/**
 * all districts and upazilla by division name. 
 * 
 * district: string, upazilla: array
 */
const queryByDivision = async (req, res) => {
    const divisionName = paramsCase(req.params.divisionName);

    const data = await prisma.districts.findMany({
        where: {
            division: {
                division: divisionName
            }
        },
        select: {
            district: true,
            upazillas: {
                select: {
                    upazilla: true
                }
            }
        },
        orderBy: {
            district: 'asc'
        }
    });

    // Transform data to match the expected format
    const transformedData = data.map(district => ({
        district: district.district,
        upazilla: district.upazillas.map(u => u.upazilla)
    }));

    printData(res, transformedData);
}

module.exports = {allDivisions, allDistricts, queryByDivision}
