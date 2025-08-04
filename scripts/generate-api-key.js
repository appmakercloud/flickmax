#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure API key
const apiKey = crypto.randomBytes(32).toString('hex');

console.log('Generated API Key:');
console.log('==================');
console.log(apiKey);
console.log('\nAdd this to your .env file:');
console.log(`API_SECRET_KEY=${apiKey}`);
console.log('\nFor client-side usage:');
console.log('Add the X-API-Key header with this value to your requests');