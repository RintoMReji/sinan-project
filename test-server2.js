// This code uses ONLY built-in Node.js features. No 'express' needed.
const http = require('http');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>SUCCESS! Node.js is working.</h1>');
});

server.listen(port, hostname, () => {
  console.log(`🚀 SIMPLE TEST SERVER is running at http://${hostname}:${port}/`);
  console.log('Please visit that address in your browser.');
});
