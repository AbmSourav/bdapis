const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Rate limiting configuration based on environment
const createRateLimiter = () => {
  if (isProduction) {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // stricter limit for production
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/status';
      }
    });
  } else {
    return rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute for testing
      max: 20, // much lower limit for testing (was 1000)
      message: {
        error: 'Rate limit reached (development mode)',
        retryAfter: '1 minute'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/status';
      }
    });
  }
};

// Security headers configuration
const createSecurityHeaders = () => {
  const config = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for API compatibility
  };

  if (isProduction) {
    config.hsts = {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    };
    config.noSniff = true;
    config.frameguard = { action: 'deny' };
  }

  return helmet(config);
};

// Input validation and sanitization
const validateAndSanitizeInput = (req, res, next) => {
  // Sanitize query parameters
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      // Remove potentially dangerous characters
      req.query[key] = req.query[key]
        .replace(/[<>\"'%;()&+]/g, '')
        .trim()
        .substring(0, 100); // Limit length
    }
  }

  // Sanitize path parameters
  for (const key in req.params) {
    if (typeof req.params[key] === 'string') {
      req.params[key] = req.params[key]
        .replace(/[<>\"'%;()&+]/g, '')
        .trim()
        .substring(0, 50);
    }
  }

  next();
};

// Enhanced logging and monitoring
const auditLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const method = req.method;
  const path = req.path;
  const query = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : '';

  // Log API access
  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}${query ? ` - Query: ${query}` : ''} - UA: ${userAgent.substring(0, 100)}`);

  // Log suspicious activity
  const suspiciousPatterns = [
    /script/i,
    /select.*from/i,
    /union.*select/i,
    /drop.*table/i,
    /<script/i,
    /javascript:/i
  ];

  const fullUrl = req.originalUrl;
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(fullUrl) || pattern.test(userAgent)
  );

  if (isSuspicious) {
    console.warn(`[SECURITY WARNING] Suspicious request detected - IP: ${ip}, URL: ${fullUrl}, UA: ${userAgent}`);
  }

  next();
};

// Health check endpoint (bypasses some security measures)
const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.6',
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  limiter: createRateLimiter(),
  securityHeaders: createSecurityHeaders(),
  validateInput: validateAndSanitizeInput,
  secureDatabaseAccess: auditLogger,
  healthCheck,
  isProduction,
  isDevelopment
};
