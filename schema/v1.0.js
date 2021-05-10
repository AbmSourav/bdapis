const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		division: String,
		divisionbn: String,
		district: String,
		districtbn: String,
		upazilla: String
	}
)

const collectionV10 = mongoose.model(process.env.COLLECTION_V1_0, schema, process.env.COLLECTION_V1_0);

module.exports = collectionV10