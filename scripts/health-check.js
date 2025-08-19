#!/usr/bin/env node
const http = require('http');

const HOST = process.env.HEALTH_URL || 'http://localhost:3000/api/health';

http.get(HOST, res => {
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Health Check Result:');
      console.table(json);
      if (json.server === 'ok' && json.prisma === 'ok' && json.database === 'ok') {
        process.exit(0);
      } else {
        process.exit(1);
      }
    } catch (e) {
      console.error('Invalid response:', data);
      process.exit(2);
    }
  });
}).on('error', err => {
  console.error('Error connecting to health endpoint:', err.message);
  process.exit(2);
}); 