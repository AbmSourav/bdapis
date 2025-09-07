const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const { dbConnect } = require('./db/connect')
const { 
  limiter, 
  securityHeaders, 
  validateInput, 
  secureDatabaseAccess,
  healthCheck
} = require('./middleware/security')
 
const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

dbConnect();

// Security middleware (apply early in the middleware stack)
app.use(securityHeaders);
app.use(limiter);
app.use(validateInput);
app.use(secureDatabaseAccess);

const corsOptions = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('X-Powered-By', 'BD API');
    next();
}

app.set('view engine', 'ejs');
app.use(express.static("views"));

// Health check endpoint (before other middleware)
app.get('/health', healthCheck);
app.get('/status', healthCheck);

app.use('/', require('./routes/static/homeRoute'));

app.use('/', corsOptions);
app.use('/', require('./routes/api/routesMap'));
app.use('/', require('./routes/api/v1.0/bdapi'));
app.use('/', require('./routes/api/v1.1/bdapi'));
app.use('/', require('./routes/api/v1.2/bdapi'));

// Global error handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  
  console.error(`[${timestamp}] ERROR - IP: ${ip}, Path: ${req.path}, Error: ${err.message}`);

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ 
      error: 'Internal server error',
      timestamp: timestamp,
      requestId: req.id || 'unknown'
    });
  } else {
    res.status(500).json({ 
      error: err.message,
      stack: err.stack,
      timestamp: timestamp
    });
  }
});

app.use('*', require('./routes/static/notFound'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on ${ PORT }...`) );
