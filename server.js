
const http = require('http'); // 1 - 載入 Node.js 原生模組 http

const PORT = process.env.PORT || 3000
http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Hello World!');
}).listen(PORT);