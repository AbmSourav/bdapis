require('dotenv').config()
const express = require('express')
const dbConnect = require('./db/connect')
const app = express()

dbConnect();

app.use(express.static("public"));
app.use('/', require('./routes/static/homeRoute'));
app.use('/', require('./routes/api/routesMap'));
app.use('/', require('./routes/api/v1/bdapi'));
app.use('*', require('./routes/static/notFound'));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
