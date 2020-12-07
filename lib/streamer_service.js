const twitch_lib = require('./lib/twitch_lib');
const streamer_repository = require('./lib/streamer_repository');
const Discord = require('discord.js');

async function get_streamer_status(channel) {
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
}

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