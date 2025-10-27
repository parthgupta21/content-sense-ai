const { createClient } = require('redis');

const client = createClient({
    url: process.env.NODE_ENV === 'PRODUCTION' ? process.env.REDIS_URL : 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

module.exports = client;