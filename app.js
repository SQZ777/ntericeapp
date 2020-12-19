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
  return client;
}

Client.on('ready', async () => {
  console.log(`Logged in as ${Client.user.tag}!`);
  const client = connectToMongodb();
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
