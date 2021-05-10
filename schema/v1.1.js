const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		division: String,
		divisionbn: String,
		divisionlatlong: String,
		district: String,
		districtbn: String,
		districtlatlong: String,
		upazilla: String
	}
)

const collectionV11 = mongoose.model(process.env.COLLECTION_V1_1, schema, process.env.COLLECTION_V1_1);

module.exports = collectionV11