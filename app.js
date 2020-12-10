const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const Discord = require('discord.js');
const { MongoDbBase } = require('./lib/mongodbBase');

const Client = new Discord.Client();
const igotalldayService = require('./lib/igotalldayYoutubeService');
const twitchLib = require('./lib/twitchLib');

// const channelNames = ['MorganTang', 'hsiny0903', 'defponytail'];
// const streamerRepository = require('./lib/streamerRepository');
const streamerService = require('./lib/streamerService');
const { requestToMyself } = require('./lib/requestMyself');

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
  const streamerCollection = new MongoDbBase('streamers');
  await streamerCollection.connectMongo();
  setInterval(async () => {
    await streamerService.run(Client, streamerCollection);
    await igotalldayService.run(Client);
  }, 3000);
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

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body); // your JSON
  res.send(req.body); // echo the result back
});

app.post('/streamer_notify', async (req, res) => {
  const testCollection = new MongoDbBase('test');
  await testCollection.connectMongo();
  await testCollection.updateData(
    { id: 1 },
    { $set: { context: req.body.data[0].user_name } },
  );
  res.send(req.body.user_name);
});

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
