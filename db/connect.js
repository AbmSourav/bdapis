const mongoose = require('mongoose')
const db_config = require('./db_config')

const dbConfig = process.env.DB_URL || db_config;

const dbConnect = () => {
    mongoose.connect(dbConfig, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
        .once( 'open', () => console.log("connected") )
        .on( 'error', error => console.log('error') );
}

module.exports = dbConnect
