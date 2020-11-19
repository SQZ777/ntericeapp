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
    setInterval(async () => {
        channel_names.forEach(async channel => {
            let streamer = await streamer_services.get_streamer(channel);
            let channel_status_resp = await twitch_lib.get_channel_status(channel);
            if (streamer.status == 'close' && channel_status_resp !== undefined) {
                let twitch_user = await twitch_lib.get_user(channel_status_resp.user_id);
                let diff_time = Math.abs(streamer.close_time - streamer.notify_time) / 1000 / 60;
                await streamer_services.update_streamer_status(streamer.name, 'open');
                if (diff_time >= 60) {
                    await client.channels.cache.get("775907977101180938").send(`HI ALL!!! ${streamer.name} 開台啦!`);
                    await client.channels.cache.get("775907977101180938").send(get_embded(channel_status_resp, twitch_user));
                    await streamer_services.update_streamer_notify_time(channel);
                }
            } else if (streamer.status == 'open' && channel_status_resp === undefined) {
                await streamer_services.update_streamer_status(streamer.name, 'close');
                await streamer_services.update_streamer_close_time(channel);
            }
        }
        )
    }, 15000);
});

function get_embded(streamer_channel, user) {
    return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(streamer_channel.title)
        .setURL(`https://www.twitch.tv/${user.login}`)
        .setAuthor(user.display_name, user.profile_image_url, `https://www.twitch.tv/${user.login}`)
        .setThumbnail(user.profile_image_url)
        .addField('Game', streamer_channel.game_name, true)
        .setImage(streamer_channel.thumbnail_url.replace("{width}", 480).replace("{height}", 240))
        .setTimestamp()
}

setInterval(() => {
    request_to_myself()
}, 60000)

client.on('message', async msg => {
    if (msg.content === 'ping') {
        msg.reply('pong pong');
        streamer_channel = await twitch_lib.get_channel_status('attackfromtaiwan')
        if (streamer_channel !== undefined) {
            user = await twitch_lib.get_user(streamer_channel.user_id);
            client.channels.cache.get("776035789108543528").send(get_embded(streamer_channel, user));
        }
    }
});

client.login(process.env.discordToken);