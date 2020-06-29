require('dotenv').config()
const mongoose = require('mongoose')
// const db_config = require('./db_config')

const dbConfig = process.env.DBURL;
// console.log(process.env.DBURL)
const dbConnect = () => {
    mongoose.connect(dbConfig, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
        .once( 'open', () => console.log("connected") )
        .on( 'error', error => console.log('error') );
}

module.exports = dbConnect
