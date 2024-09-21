const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose')

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

// params first letter upperCase
const paramsCase = (param) => {
    const paramLength = param.split(" ").length;

    if (paramLength > 1) {
        return param.replace(/^\w/, firstChr => firstChr.toUpperCase());
    }

    return param.toLowerCase().replace(/^\w/, firstChr => firstChr.toUpperCase());
}

// print json data or error on the endpoint
const printData = (res, apiData) => {
	const response = {
        status: {},
        data: [],
    };

	let dateTime = new Date();
	dateTime = dateTime.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, 
        timeZone: 'Asia/Dhaka'
    });

    response['data'] = apiData;
    if (! apiData || apiData.length == 0) {
        response['status'] = { code: 404, message: "not found", date: dateTime };
    } else {
        response['status'] = { code: 200, message: "ok", date: dateTime };
    }

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
    if (districts.upazillas && districts.upazillas.length) {
        districts.upazillas.map((upazilla, index) => {
            districts.upazillas[index] = upazilla.upazilla
        })
    }

    printData(res, data);
}

module.exports = {allDivisions, allDistricts, queryByDivision, queryByDistrict}
