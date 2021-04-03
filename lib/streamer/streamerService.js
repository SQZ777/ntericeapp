const Discord = require('discord.js');
const twitchService = require('../twitchService');
const { StreamerRepository } = require('./streamerRepository');
const { TwitchRepository } = require('../twitch/twitchRepository');

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
 * @param {{status:string}} channel.name
 */
async function run(client, streamerCollection, twitchCollection) {
  const streamerRepository = new StreamerRepository(streamerCollection);
  const twitchRepository = new TwitchRepository(twitchCollection);
  const twitchToken = await twitchRepository.getToken();
  const clientId = twitchToken.ClientId;
  const authorization = twitchToken.Authorization;
  const channels = await streamerRepository.getStreamers();
  channels.map(async (channel) => {
    const streamer = await streamerRepository.getStreamer(channel.name);
    const channelStatusResp = await twitchService.getChannelStatus(
      channel.name,
      clientId,
      authorization,
    );
    if (streamer.status === 'close' && channelStatusResp !== undefined) {
      const twitchUser = await twitchService.getUser(
        channelStatusResp.user_id,
        clientId,
        authorization,
      );
      const diffTimeNow = Math.abs(new Date() - streamer.close_time) / 60000;
      await streamerRepository.updateStreamerStatus(streamer.name, 'open');
      if (diffTimeNow >= 180) {
        await streamerRepository.updateStreamerNotifyTime(streamer.name);
        await sendMessage(client, streamer, channelStatusResp, twitchUser);
      }
    } else if (streamer.status === 'open' && !channelStatusResp) {
      await streamerRepository.updateStreamerStatus(streamer.name, 'close');
      await streamerRepository.updateStreamerCloseTime(channel.name);
    }
  });
}

module.exports = {
  run,
};
