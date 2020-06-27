const express = require('express');
const dbConnect = require('./db/connect');
const app = express()

dbConnect();

const routeNameSpace = "/api"
const apiVone = "/v1"
const routePrefix = routeNameSpace + apiVone

app.use('/', require('./routes/static/homeRoute'));
app.use(routePrefix, require('./routes/api/v1/bdapi'));
app.use('*', require('./routes/static/notFound'));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
