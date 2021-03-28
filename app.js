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
  const twitchCollection = new MongoDbBase(client, 'twitch');
  const igotalldayCollection = new MongoDbBase(client, 'igotallday');
  setInterval(async () => {
    await streamerService.run(Client, streamerCollection, twitchCollection);
    await igotalldayService.run(Client, igotalldayCollection);
  }, 15000);
});

Client.on('message', async (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong pong');
  }
  await apexSearchService.run(msg);
});

Client.login(process.env.discordToken);

app.use(express.json());

app.post('/Twitch/CallBack', (req, res) => {
  res.send(req);
  console.log('this request is from twitch');
});

app.get('/', (req, res) => {
  res.send(req);
});

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
