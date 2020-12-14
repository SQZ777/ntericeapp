const Discord = require('discord.js');
const twitchLib = require('./twitchLib');
const { StreamerRepositoryV2 } = require('./streamerRepositoryV2');

function getStreamerEmbded(streamerChannel, user) {
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(streamerChannel.title)
    .setURL(`https://www.twitch.tv/${user.login}`)
    .setAuthor(
      user.display_name,
      user.profile_image_url,
      `https://www.twitch.tv/${user.login}`,
    )
    .setThumbnail(user.profile_image_url)
    .addField('Game', streamerChannel.game_name, true)
    .setImage(
      streamerChannel.thumbnail_url
        .replace('{width}', 480)
        .replace('{height}', 240),
    )
    .setTimestamp();
}

async function sendMessage(client, streamer, channelStatusResp, twitchUser) {
  await client.channels.cache
    .get('775907977101180938')
    .send(`HI ALL!!! ${streamer.name} 開台啦!`);
  await client.channels.cache
    .get('775907977101180938')
    .send(getStreamerEmbded(channelStatusResp, twitchUser));
}

/**
 * @param {{status:string}} channel
 */
async function run(client, streamerCollection) {
  const channelNames = ['thisiceisfromtaiwan'];
  channelNames.map(async (channel) => {
    const streamerService = new StreamerRepositoryV2(streamerCollection);
    const streamer = await streamerService.getStreamer(channel);
    const channelStatusResp = await twitchLib.getChannelStatus(channel);
    if (streamer.status === 'close' && channelStatusResp !== undefined) {
      const twitchUser = await twitchLib.getUser(channelStatusResp.user_id);
      const diffTimeNow = Math.abs(new Date() - streamer.close_time) / 60000;
      await streamerService.updateStreamerStatus(streamer.name, 'open');
      if (diffTimeNow >= 60) {
        await streamerService.updateStreamerNotifyTime(streamer.name);
        await sendMessage(client, streamer, channelStatusResp, twitchUser);
      }
    } else if (streamer.status === 'open' && !channelStatusResp) {
      await streamerService.updateStreamerStatus(streamer.name, 'close');
      await streamerService.updateStreamerCloseTime(channel);
    }
  });
}

module.exports = {
  run,
};
