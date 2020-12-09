require('dotenv').config();
const {
  Discord,
  Client,
} = require('discord.js');
const igotalldayService = require('./lib/igotalldayYoutube');
const twitchLib = require('./lib/twitch_lib');
const streamerRepository = require('./lib/streamerRepository');
const {
  requestToMyself,
} = require('./lib/requestMyself');

const channelNames = ['MorganTang', 'thisiceisfromtaiwan', 'hsiny0903', 'defponytail'];

setInterval(() => {
  requestToMyself();
}, 600000);

function getStreamerEmbded(streamerChannel, user) {
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(streamerChannel.title)
    .setURL(`https://www.twitch.tv/${user.login}`)
    .setAuthor(user.display_name, user.profile_image_url, `https://www.twitch.tv/${user.login}`)
    .setThumbnail(user.profile_image_url)
    .addField('Game', streamerChannel.game_name, true)
    .setImage(streamerChannel.thumbnail_url.replace('{width}', 480).replace('{height}', 240))
    .setTimestamp();
}

Client.on('ready', async () => {
  console.log(`Logged in as ${Client.user.tag}!`);
  setInterval(async () => {
    channelNames.forEach(async (channel) => {
      const streamer = await streamerRepository.get_streamer(channel);
      const channelStatusResp = await twitchLib.get_channel_status(channel);
      if (streamer.status === 'close' && channelStatusResp !== undefined) {
        const twitchUser = await twitchLib.get_user(channelStatusResp.user_id);
        const diffTimeNow = Math.abs(new Date() - streamer.close_time) / 1000 / 60;
        await streamerRepository.update_streamer_status(streamer.name, 'open');
        if (diffTimeNow >= 60) {
          await Client.channels.cache.get('775907977101180938').send(`HI ALL!!! ${streamer.name} 開台啦!`);
          await Client.channels.cache.get('775907977101180938').send(getStreamerEmbded(channelStatusResp, twitchUser));
          await streamerRepository.update_streamer_notify_time(channel);
        }
      } else if (streamer.status === 'open' && channelStatusResp === undefined) {
        await streamerRepository.update_streamer_status(streamer.name, 'close');
        await streamerRepository.update_streamer_close_time(channel);
      }
    });

    const newVideoV2 = await igotalldayService.get_latest_video_v2();
    if (newVideoV2 !== null) {
      Client.channels.cache.get('775905509374558208').send(newVideoV2);
    }
  }, 15000);
});

Client.on('message', async (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong pong');
    const streamerChannel = await twitchLib.get_channel_status('attackfromtaiwan');
    if (streamerChannel !== undefined) {
      const user = await twitchLib.get_user(streamerChannel.user_id);
      Client.channels.cache.get('776035789108543528').send(getStreamerEmbded(streamerChannel, user));
    }
  }
});

Client.login(process.env.discordToken);
