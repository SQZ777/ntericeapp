require('dotenv').config();
const Discord = require('discord.js');

const Client = new Discord.Client();
const igotalldayService = require('./lib/igotalldayYoutubeService');
const twitchLib = require('./lib/twitchLib');
const streamerRepository = require('./lib/streamerRepository');
const { requestToMyself } = require('./lib/requestMyself');

const channelNames = ['MorganTang', 'hsiny0903', 'defponytail'];

setInterval(() => {
  requestToMyself();
}, 600000);

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

Client.on('ready', async () => {
  console.log(`Logged in as ${Client.user.tag}!`);
  setInterval(async () => {
    channelNames.forEach(async (channel) => {
      const streamer = await streamerRepository.getStreamer(channel);
      const channelStatusResp = await twitchLib.getChannelStatus(channel);
      if (streamer.status === 'close' && channelStatusResp !== undefined) {
        const twitchUser = await twitchLib.getUser(channelStatusResp.user_id);
        const diffTimeNow = Math.abs(new Date() - streamer.close_time) / 60000;
        await streamerRepository.updateStreamerStatus(streamer.name, 'open');
        if (diffTimeNow >= 60) {
          await Client.channels.cache
            .get('775907977101180938')
            .send(`HI ALL!!! ${streamer.name} 開台啦!`);
          await Client.channels.cache
            .get('775907977101180938')
            .send(getStreamerEmbded(channelStatusResp, twitchUser));
          await streamerRepository.updateStreamerNotifyTime(channel);
        }
      } else if (streamer.status === 'open' && !channelStatusResp) {
        await streamerRepository.updateStreamerStatus(streamer.name, 'close');
        await streamerRepository.updateStreamerCloseTime(channel);
      }
    });

    await igotalldayService.run(Client);
  }, 15000);
});

Client.on('message', async (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong pong');
    const streamerChannel = await twitchLib.getChannelStatus(
      'attackfromtaiwan',
    );
    if (streamerChannel !== undefined) {
      const user = await twitchLib.getUser(streamerChannel.user_id);
      Client.channels.cache
        .get('776035789108543528')
        .send(getStreamerEmbded(streamerChannel, user));
    }
  }
});

Client.login(process.env.discordToken);
