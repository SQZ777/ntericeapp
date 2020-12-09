const http = require('http'); // 1 - 載入 Node.js 原生模組 http

const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/streamer_notify') {
      console.log('POST');
      let body = '';
      req.on('data', (data) => {
        body += data;
        console.log(`Partial body: ${body}`);
      });
      req.on('end', () => {
        console.log(`Body: ${body}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`post received${body}`);
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Hello World!');
    }
  })
  .listen(PORT);
