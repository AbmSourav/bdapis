const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose')

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

const schema = new mongoose.Schema({_id: Number})  
// const dbData = mongoose.model(process.env.COLLECTION_V1_1, schema, process.env.COLLECTION_V1_1);

// params first letter upperCase
const paramsCase = (param) => {
    return param.toLowerCase().replace(/^\w/, firstChr => firstChr.toUpperCase());
}

// print json data or error on the endpoint
const printData = (res, apiData) => {
	const response = {};

	let dateTime = new Date();
	dateTime = dateTime.toGMTString();

	response['status'] = { code: 200, message: "ok", date: dateTime };
	response['data'] = apiData;

    try {
        res.json(response);
    } catch (err) {
        res.send(err);
    }
}

/**
 * all divisions. 
 * 
 * route /divisions
 */
const allDivisions = async (req, res) => {
    const data = await prisma.divisions.findMany({
        select: {
            division: true,
            divisionbn: true,
            coordinates: true
        }
    });

    printData(res, data);
}

/**
 * all districts. 
 *
 * route /districts 
 */
const allDistricts = async (req, res) => {
    const data = await prisma.districts.findMany({
        select: {
            district: true,
            districtbn: true,
            coordinates: true
        }
    });

    printData(res, data);
}

/**
 * all districts and upazilla by division name. 
 *
 * route /divisions/:divisionName 
 */
const queryByDivision = async (req, res) => {
    const divisionName = paramsCase(req.params.divisionName);

    const data = await prisma.divisions.findMany({
        "where": {
            "division": divisionName
        },
        "select": {
            districts: {
                select: {
                    district: true,
                    districtbn: true,
                    coordinates: true,
                    upazillas: {
                        select: {
                            upazilla: true
                        }
                    }
                }
            }
        }
    })

    let districts = data[0]?.districts || false;
    if (districts.length) {
        districts.map((district, index) => {
            districts[index].upazilla = []
            district.upazillas.map((upazilla) => {
                districts[index].upazilla.push(upazilla.upazilla)
            });

            delete districts[index].upazillas
        })
    }

    printData(res, districts);
}

const queryByDistrict = async (req, res) => {
    const districtName = paramsCase(req.params.districtName);

    const data = await prisma.districts.findMany({
        "where": {
            "district": districtName
        },
        "select": {
            district: true,
            districtbn: true,
            coordinates: true,
            upazillas: {
                select: {
                    upazilla: true
                }
            }
        }
    })

    let districts = data[0] || false;
    if (districts.upazillas.length) {
        districts.upazillas.map((upazilla, index) => {
            districts.upazillas[index] = upazilla.upazilla
        })
    }

    printData(res, districts);
}

module.exports = {allDivisions, allDistricts, queryByDivision, queryByDistrict}
