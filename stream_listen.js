//引用'http'模組
const http = require('http');

//設定server網址，因為在本機端測試，所以輸入127.0.0.1
const hostname = 'https://api.twitch.tv/helix/'  //上傳至伺服器需拿掉

//新增一個server並指定他的頁面資訊，內容為'Hello World!'
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Client-ID', 'leelbgmv51u0sq5xoo9uutmf0pgfhq');
    res.setHeader('Authorization', 'Bearer 0pa4ee6t2c4nvrrctjyt5noopvfhk1');
    res.end('Hello World!\n');
});

//監聽得到的 port 號開啟
server.listen(port, () => console.log(`Listening on ${port}`));