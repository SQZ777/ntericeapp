const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const Discord = require('discord.js');
const { MongoClient } = require('mongodb');
const { MongoDbBase } = require('./lib/mongodbBase');

const Client = new Discord.Client();
const igotalldayService = require('./lib/igotalldayYoutubeService');
const streamerService = require('./lib/streamerService');
const apexSearchService = require('./lib/apexSearchService');
const { requestToMyself } = require('./lib/requestMyself');

setInterval(() => {
  requestToMyself();
}, 600000);

async function connectToMongodb() {
  const client = await MongoClient.connect(process.env.mongoHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(`something went wrong: ${err}`);
    throw err;
  });
  console.log('connect success.');
  return client;
}

Client.on('ready', async () => {
  console.log(`Logged in as ${Client.user.tag}!`);
  const client = await connectToMongodb();
  const streamerCollection = new MongoDbBase(client, 'streamers');
  const igotalldayCollection = new MongoDbBase(client, 'igotallday');
  setInterval(async () => {
    await streamerService.run(Client, streamerCollection);
    await igotalldayService.run(Client, igotalldayCollection);
  }, 15000);
});

Client.on('message', async (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong pong');
  }
  const msgContent = msg.content;
  const command = msgContent.slice(0, 5).toLowerCase();
  const indexOf2ndSpace = msgContent.indexOf(' ', 6);
  const platform = msgContent.slice(6, indexOf2ndSpace);
  const playerName = msgContent.slice(indexOf2ndSpace + 1, msgContent.length);
  if (command === '/apex' && platform && playerName) {
    const playerStatusMsg = await apexSearchService.getApexPlayerStatus(
      platform,
      playerName,
    );
    msg.reply(playerStatusMsg);
  } else if (command === '/apex') {
    msg.reply(
      '輸入格式為 /apex {查詢的平台} {玩家名稱}，請重新再試，查詢平台有 pc xbox psn',
    );
  }
});

Client.login(process.env.discordToken);

app.use(express.json());

app.post('/streamer_notify', async (req, res) => {
  Client.channels.cache
    .get('776035789108543528')
    .send('有人打我!! streamer_notify');
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
