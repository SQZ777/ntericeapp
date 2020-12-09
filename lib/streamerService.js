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

async function run(client, streamerCollection) {
  
}
