const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const dbConnect = require('./db/connect')
const app = express()


dbConnect();

const corsOptions = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('X-Powered-By', 'BD API');
    next();
}

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use('/', require('./routes/static/homeRoute'));

app.use('/', corsOptions);
app.use('/', require('./routes/api/routesMap'));
app.use('/', require('./routes/api/v1.0/bdapi'));
app.use('/', require('./routes/api/v1.1/bdapi'));
app.use('/', require('./routes/api/v1.2/bdapi'));
app.use('*', require('./routes/static/notFound'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on ${ PORT }...`) );
