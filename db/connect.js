const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose')

const dbConfig = process.env.DBURL;

const dbConnect = () => {
    mongoose.connect(dbConfig, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
        .once( 'open', () => console.log("connected") )
        .on( 'error', error => console.log('error') );
}

module.exports = dbConnect
