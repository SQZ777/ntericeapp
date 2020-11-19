require('dotenv').config();
const twitch_lib = require('./lib/twitch_lib')

const http = require('http'); // 1 - 載入 Node.js 原生模組 http

const PORT = process.env.PORT || 3000
http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Hello World!');
}).listen(PORT);


const {
    request_to_myself
} = require('./lib/request_myself')
const streamer_services = require('./lib/streamer_services')
const Discord = require('discord.js');
const client = new Discord.Client();
var channel_names = ['MorganTang', 'AttackFromTaiwan', 'hsiny0903']

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // client.channels.cache.get("776035789108543528").send(`${client.user.tag} 前來報到`);
    setInterval(async () => {
        channel_names.forEach(async channel => {
            let streamer = await streamer_services.get_streamer(channel);
            let channel_status_resp = await twitch_lib.get_channel_status(channel);
            console.log(streamer)
            if (streamer.status == 'close' && channel_status_resp !== undefined) {
                let diff_time_now = Math.abs(new Date - streamer.close_time) / 1000 / 60;
                await streamer_services.update_streamer_status(streamer.name, 'open');
                if (diff_time_now >= 60) { // image 320x180
                    client.channels.cache.get("776035789108543528").send(`${channel} 開台啦!`);
                    streamer_services.update_streamer_notify_time(channel);
                }
            } else if (streamer.status == 'open' && channel_status_resp === undefined) {
                await streamer_services.update_streamer_status(streamer.name, 'close');
                await streamer_services.update_streamer_close_time(channel);
            }
        }
    )}, 15000);
});

setInterval(() => {
    request_to_myself()
}, 60000)

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong pong');
    }
});

client.login(process.env.discordToken);