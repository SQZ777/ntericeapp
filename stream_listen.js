require('dotenv').config();
const igotallday_service = require('./lib/igotallday_youtube');
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
var channel_names = ['MorganTang', 'thisiceisfromtaiwan', 'hsiny0903']

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(async () => {
        channel_names.forEach(async channel => {
            let streamer = await streamer_services.get_streamer(channel);
            let channel_status_resp = await twitch_lib.get_channel_status(channel);
            if (streamer.status == 'close' && channel_status_resp !== undefined) {
                let twitch_user = await twitch_lib.get_user(channel_status_resp.user_id);
                let diff_time_now = Math.abs(new Date - streamer.close_time) / 1000 / 60;
                await streamer_services.update_streamer_status(streamer.name, 'open');
                if (diff_time_now >= 60) {
                    await client.channels.cache.get("775907977101180938").send(`HI ALL!!! ${streamer.name} 開台啦!`);
                    await client.channels.cache.get("775907977101180938").send(get_streamer_embded(channel_status_resp, twitch_user));
                    await streamer_services.update_streamer_notify_time(channel);
                }
            } else if (streamer.status == 'open' && channel_status_resp === undefined) {
                await streamer_services.update_streamer_status(streamer.name, 'close');
                await streamer_services.update_streamer_close_time(channel);
            }

            if(await igotallday_service.is_video_latest(new_video.videoId)){
                await client.channels.cache.get("776035789108543528").send(get_igotallday_embded(new_video));
                let current_video_id = await igotallday_service.get_current_video_id()
                await igotallday_service.update_latest_video(current_video_id, new_video.videoId);
            }
        }
        )
    }, 15000);
});

function get_streamer_embded(streamer_channel, user) {
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

function get_igotallday_embded(video) {
    return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(video.title.runs[0].text)
        .setURL(`https://www.youtube.com/watch?v=${video.videoId}`)
        .setAuthor("反正我很閒", "https://yt3.ggpht.com/ytc/AAUvwngTztH-bT1CgpL9FwQWS1Mco0MFjXyu2zuNGnKg=s88-c-k-c0x00ffffff-no-rj", `https://www.youtube.com/watch?v=${video.videoId}`)
        .setThumbnail(video.thumbnail.thumbnails[3].url)
        .setImage(video.thumbnail.thumbnails[3].url)
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
            client.channels.cache.get("776035789108543528").send(get_streamer_embded(streamer_channel, user));
        }
    }
});

client.on('message', async msg => {
    if (msg.content === 'pong') {
        msg.reply('ping');
        let new_video = await igotallday_service.get_newest_video();
        if(await igotallday_service.is_video_latest(new_video.videoId)){
            await client.channels.cache.get("776035789108543528").send(get_igotallday_embded(new_video));
            let current_video_id = await igotallday_service.get_current_video_id()
            await igotallday_service.update_latest_video(current_video_id, new_video.videoId);
        }
        
    }
});

client.login(process.env.discordToken);