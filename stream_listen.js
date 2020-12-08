require('dotenv').config();
const igotallday_service = require('./lib/igotallday_youtube');
const twitch_lib = require('./lib/twitch_lib');
const streamer_repository = require('./lib/streamer_repository');
const Discord = require('discord.js');
const client = new Discord.Client();
var channel_names = ['MorganTang', 'thisiceisfromtaiwan', 'hsiny0903', 'defponytail'];
const test = require('./test.js')
const {
    request_to_myself
} = require('./lib/request_myself')

setInterval(() => {
    request_to_myself()
}, 600000)

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(async () => {
        channel_names.forEach(async channel => {
            let streamer = await streamer_repository.get_streamer(channel);
            let channel_status_resp = await twitch_lib.get_channel_status(channel);
            if (streamer.status == 'close' && channel_status_resp !== undefined) {
                let twitch_user = await twitch_lib.get_user(channel_status_resp.user_id);
                let diff_time_now = Math.abs(new Date - streamer.close_time) / 1000 / 60;
                await streamer_repository.update_streamer_status(streamer.name, 'open');
                if (diff_time_now >= 60) {
                    await client.channels.cache.get("775907977101180938").send(`HI ALL!!! ${streamer.name} 開台啦!`);
                    await client.channels.cache.get("775907977101180938").send(get_streamer_embded(channel_status_resp, twitch_user));
                    await streamer_repository.update_streamer_notify_time(channel);
                }
            } else if (streamer.status == 'open' && channel_status_resp === undefined) {
                await streamer_repository.update_streamer_status(streamer.name, 'close');
                await streamer_repository.update_streamer_close_time(channel);
            }
        })

        let new_video_v2 = await igotallday_service.get_latest_video_v2();
        if (new_video_v2 !== null) {
            client.channels.cache.get("775905509374558208").send(new_video_v2);
        }
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

client.on('message', async msg => {
    if (msg.content === 'ping') {
        msg.reply('pong pong');
        streamer_channel = await twitch_lib.get_channel_status('attackfromtaiwan')
        if (streamer_channel !== undefined) {
            user = await twitch_lib.get_user(streamer_channel.user_id);
            client.channels.cache.get("776035789108543528").send(get_streamer_embded(streamer_channel, user));
        }
        console.log('going to test')
        test.go(client)
        console.log('test done')
    }
});

client.login(process.env.discordToken);