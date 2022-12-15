const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose')

const dbConfig = process.env.DBURL;

const dbConnect = () => {
    mongoose.connect(dbConfig, {useNewUrlParser: true, useUnifiedTopology: true})
        .catch(error => console.log("MongoDB connection failed.", error));
    mongoose.connection
        .once( 'open', () => console.log("MongoDB connected..") )
        .on( 'error', error => console.log('error') );
}

module.exports = dbConnect
