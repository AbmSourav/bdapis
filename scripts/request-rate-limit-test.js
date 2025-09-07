const http = require('http');

// Quick rate limit test with lower numbers
const CONFIG = {
  host: 'localhost',
  port: 3000,
  testEndpoint: '/api/v1.1/divisions',
  maxRequests: 25, // Lower number for quick test
  delay: 100 // 100ms delay between requests
};

async function makeRequest(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: CONFIG.host,
      port: CONFIG.port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });

    req.on('error', (error) => {
      resolve({ statusCode: 0, error: error.message });
    });

    req.end();
  });
}

async function testRateLimit() {
  console.log('🔒 Quick Rate Limit Test');
  console.log('========================');
  console.log(`Making ${CONFIG.maxRequests} requests to ${CONFIG.testEndpoint}`);
  console.log('Result: . = 200 OK, R = 429 Rate Limited, E = Error\n');

  let successful = 0;
  let rateLimited = 0;
  let errors = 0;

  for (let i = 1; i <= CONFIG.maxRequests; i++) {
    const response = await makeRequest(CONFIG.testEndpoint);
    
    if (response.statusCode === 200) {
      successful++;
      process.stdout.write('.');
    } else if (response.statusCode === 429) {
      rateLimited++;
      process.stdout.write('R');
      
      // Show rate limit headers
      if (i === successful + 1) { // First rate limited response
        console.log('\n\n📋 Rate Limit Headers:');
        Object.keys(response.headers || {}).forEach(header => {
          if (header.toLowerCase().includes('ratelimit') || header.toLowerCase().includes('retry')) {
            console.log(`${header}: ${response.headers[header]}`);
          }
        });
        console.log('Continuing test...\n');
      }
    } else {
      errors++;
      process.stdout.write('E');
    }

    if (i % 25 === 0) console.log(''); // New line every 25 requests
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, CONFIG.delay));
  }

  console.log('\n\n📊 Results:');
  console.log(`Successful (200): ${successful}`);
  console.log(`Rate Limited (429): ${rateLimited}`);
  console.log(`Errors: ${errors}`);

  if (rateLimited > 0) {
    console.log('\n✅ Rate limiting is working!');
    console.log(`Rate limit triggered after ${successful} successful requests`);
  } else {
    console.log('\n⚠️  Rate limiting not triggered');
    console.log('You may need to restart the server or make requests faster');
  }
}

testRateLimit().catch(console.error);
