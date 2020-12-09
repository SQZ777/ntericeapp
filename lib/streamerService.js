const { Discord } = require('discord.js');
const twitchLib = require('./lib/twitchLib');
const streamerRepository = require('./lib/streamerRepository');

function getStreamerEmbded(streamerChannel, user) {
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(streamerChannel.title)
    .setURL(`https://www.twitch.tv/${user.login}`)
    .setAuthor(
      user.display_name,
      user.profile_image_url,
      `https://www.twitch.tv/${user.login}`
    )
    .setThumbnail(user.profile_image_url)
    .addField('Game', streamerChannel.game_name, true)
    .setImage(
      streamerChannel.thumbnail_url
        .replace('{width}', 480)
        .replace('{height}', 240)
    )
    .setTimestamp();
}
