const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const Discord = require('discord.js');
const { MongoClient } = require('mongodb');
const { MongoDbBase } = require('./lib/mongodbBase');

const Client = new Discord.Client();
const igotalldayService = require('./lib/igotalldayYoutubeService');
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
  const igotalldayCollection = new MongoDbBase(client, 'igotallday');
  setInterval(async () => {
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

app.post('/Twitch/CallBack', async (req, res) => {
  if (req.body.challenge) {
    res.send(req.body.challenge);
  }
  if (req.body.event) {
    const streamerLoginName = req.body.event.broadcaster_user_login;
    const streamerName = req.body.event.broadcaster_user_name;
    Client.channels.cache
      .get('775907977101180938')
      .send(`HI ALL!!! ${streamerName} 開台啦!\n https://www.twitch.tv/${streamerLoginName}`);
  }
  console.log(req.body);
  console.log(req.header('twitch-eventsub-message-signature'));
  console.log(req.header('Twitch-Eventsub-Message-Id'));
  console.log(req.header('Twitch-Eventsub-Message-Timestamp'));

  res.send(req.body);
});

app.get('/', (req, res) => {
  res.send(req);
});

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
