require('dotenv').config();
var http = require('http'); // 1 - 載入 Node.js 原生模組 http
 
var server = http.createServer(function (req, res) {   // 2 - 建立server
    if(req.url=='/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('this app is alive');
        res.end();
    }
});

var port = precess.env.port || 3000
server.listen(port, '127.0.0.1', ()=>{
    console.log(`Server running at http://127.0.0.1:3000/`);
});
 

// const {
//     getRequest
// } = require('./lib/request');
// const Discord = require('discord.js');
// const client = new Discord.Client();
// var channel_notify_dict = {
//     'morgantang': {
//         status: 'close',
//         notify_time: '',
//         close_time: ''
//     },
//     'attackfromtaiwan': {
//         status: 'close',
//         notify_time: '',
//         close_time: ''
//     },
//     'hsiny0903': {
//         status: 'close',
//         notify_time: '',
//         close_time: ''
//     }
// }

// client.on('ready', async () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//     // client.channels.cache.get("776035789108543528").send(`${client.user.tag} 前來報到`);
//     setInterval(async () => {
//         for (const channel_name in channel_notify_dict) {
//             var channel_status_resp = await get_channel_status(channel_name)
//             if (channel_status_resp === undefined) {
//                 if (channel_notify_dict[channel_name].status === 'open') {
//                     channel_notify_dict[channel_name].close_time = new Date()
//                 }
//                 channel_notify_dict[channel_name].status = 'close'
//             } else {
//                 now_time = new Date()

//                 if (channel_notify_dict[channel_name].notify_time === "") {
//                     client.channels.cache.get("776035789108543528").send(`${channel_name} 開台啦!`);
//                 } else {
//                     // image 320x180
//                     clostime_diff_with_notifytime = Math.abs(channel_notify_dict[channel_name].close_time - channel_notify_dict[channel_name].notify_time) / 1000 / 60
//                     if (clostime_diff_with_notifytime >= 120 && channel_notify_dict[channel_name].close_time !== "") {
//                         client.channels.cache.get("776035789108543528").send(`${channel_name} 開台啦!RRRRRRRRRRRR`);
//                     }
//                 }
//                 channel_notify_dict[channel_name].status = 'open';
//                 channel_notify_dict[channel_name].notify_time = new Date(channel_status_resp.started_at);
//             }
//         }
//     }, 3000);
// });

// client.on('message', msg => {
//     if (msg.content === 'ping') {
//         msg.reply('pong');
//     }
// });

// async function get_channel_status(channel_name) {
//     const resp = await getRequest({
//         url: `https://api.twitch.tv/helix/streams?user_login=${channel_name}`,
//         headers: {
//             'Client-ID': process.env.twitchClientId,
//             'Authorization': process.env.twitchAuthorization,
//         },
//         json: true,
//     });
//     return resp.body.data[0];
// }

// client.login(process.env.discordToken);