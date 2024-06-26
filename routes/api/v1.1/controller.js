const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose')

const schema = new mongoose.Schema({_id: Number})  
const dbData = mongoose.model(process.env.COLLECTION_V1_1, schema, process.env.COLLECTION_V1_1);

// params first letter upperCase
const paramsCase = (param) => {
    return param.toLowerCase().replace(/^\w/, firstChr => firstChr.toUpperCase());
}

// print json data or error on the endpoint
const printData = (res, apiData) => {
	const response = {};

	let dateTime = new Date();
	dateTime = dateTime.toGMTString();

	response['status'] = {
        code: 200,
        message: "ok",
        date: dateTime,
        notice: "v1.1 is depricated, please use v1.2. v1.1 will be removed soon."
    };
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
 * division: string, divisionbn: string
 */
const allDivisions = async (req, res) => {
    const data = await dbData.aggregate([
        { 
            $group: { 
                _id: { $toLower: "$division" }, 
                division: { $first: "$division" },
                divisionbn: { $first: "$divisionbn" },
				coordinates: { $first: "$divisionlatlong" },
            }
        },
        { $sort : { division : 1 } }, 
    ]);

    printData(res, data);
}

/**
 * all districts. 
 * 
 * district: string, districtbn: string
 */
const allDistricts = async (req, res) => {
    const data = await dbData.aggregate([
        { 
            $group: { 
                _id: { $toLower: "$district" }, 
                district: { $first: "$district" },
                districtbn: { $first: "$districtbn" },
				coordinates: { $first: "$districtlatlong" },
            } 
        },
        { $sort : { district : 1 } },
    ]);

    printData(res, data);
}

/**
 * all districts and upazilla by division name. 
 * 
 * district: string, upazilla: array
 */
const queryByDivision = async (req, res) => {
    const divisionName = paramsCase(req.params.divisionName);

    const data = await dbData.aggregate([
        {
            $match: { division: divisionName }
        },
        { 
            $group: { 
                _id: { $toLower: "$district" },
                district: { $first: "$district" },
				coordinates: { $first: "$districtlatlong" },
                upazilla: { $push: "$upazilla" }
            } 
        },
        { $sort : { district : 1 } }
    ]);

    printData(res, data);
}

module.exports = {allDivisions, allDistricts, queryByDivision}
