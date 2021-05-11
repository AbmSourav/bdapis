const dotenv = require('dotenv')
dotenv.config();

const path = require('path')
const mongoose = require('mongoose')
const dbConnect = require('./db/connect')
const collectionV11 = require('./schema/v1.1')
const {localDB} = require('@abmsourav/localdb')

const ldb = localDB(path.resolve('./', './bdapiData.json'));
dbConnect();

const insertData = (collection) => {
	ldb.get()
		.then( data => {
			collection.insertMany(JSON.parse(data))
				.then( newData => console.log(newData) )
				.catch( err => console.log(err) );
		})
		.catch( err => console.log(err) );
}

// insert version 1.1 data in the database
insertData(collectionV11);
