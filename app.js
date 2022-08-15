const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const Discord = require('discord.js');
const { MongoClient } = require('mongodb');
const { MongoDbBase } = require('./lib/mongodbBase');
const { StreamerRepository } = require('./lib/streamer/streamerRepository');
const { VoiceStateRecordRepository } = require('./lib/discord/voiceStateRecordRepository');

const Client = new Discord.Client();
const igotalldayService = require('./lib/igotallday/igotalldayYoutubeService');
const streamerLiveTimeService = require('./lib/streamer/streamerLiveTimeService');
const { requestToMyself } = require('./lib/requestMyself');
const { handleMessage } = require('./lib/discord/onMessage');
const { handleVoiceStateUpdate } = require('./lib/discord/voiceStateUpdate');
const { handleReactionAdd } = require('./lib/discord/messageReactionAdd');

let voiceStateRecordCollection;
let voiceStateRecordRepository;
let mongodbConnetionFlag = false;

setInterval(() => {
  requestToMyself();
}, 600000);

function SignatureIsValid(req, broadcasterUserId) {
  const id = req.headers['twitch-eventsub-message-id'];
  const timestamp = req.headers['twitch-eventsub-message-timestamp'];
  const signature = req.headers['twitch-eventsub-message-signature'].split('=');

  const buf = Buffer.from(JSON.stringify(req.body));
  const calculatedSignature = crypto
    .createHmac(signature[0], `${broadcasterUserId}${process.env.twitchSubscribeSecret}`)
    .update(id + timestamp + buf)
    .digest('hex');
  const twitchSignature = signature[1];
  return calculatedSignature === twitchSignature;
}

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
  mongodbConnetionFlag = true;
  const igotalldayCollection = new MongoDbBase(client, 'igotallday');
  voiceStateRecordCollection = new MongoDbBase(client, 'voiceStateRecord');
  voiceStateRecordRepository = new VoiceStateRecordRepository(voiceStateRecordCollection);
  setInterval(async () => {
    await igotalldayService.run(Client, igotalldayCollection);
  }, 15000);
});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Client.on('message', async (msg) => {
  await handleMessage(msg, voiceStateRecordRepository);
  const flatterMsgList = ['太有料了ㄅ', '6', '猛ㄉ', '太會了吧', '狂', '扯= =', '很會'];
  if (msg.reference) {
    if (msg.content === '幫吹') {
      msg.channel.send(flatterMsgList[getRandom(0, flatterMsgList.length - 1)]);
    }
  }
});

Client.on('messageReactionAdd', async (reaction, user) => {
  await handleReactionAdd(reaction, user);
});

Client.on('voiceStateUpdate', async (oldState, newState) => {
  if (mongodbConnetionFlag) {
    handleVoiceStateUpdate(voiceStateRecordRepository, oldState, newState);
  }
});

Client.login(process.env.discordToken);

app.use(express.json());

app.post('/Twitch/CallBack', async (req, res) => {
  console.log(req.body);
  console.log(req.header('twitch-eventsub-message-signature'));
  console.log(req.header('Twitch-Eventsub-Message-Id'));
  console.log(req.header('Twitch-Eventsub-Message-Timestamp'));
  if (req.body.challenge) {
    if (SignatureIsValid(req, req.body.subscription.condition.broadcaster_user_id)) {
      res.send(req.body.challenge);
    }
    return;
  }
  if (SignatureIsValid(req, req.body.event.broadcaster_user_id)) {
    if (req.body.event) {
      const streamerLoginName = req.body.event.broadcaster_user_login;
      const streamerId = req.body.event.broadcaster_user_id;
      const streamerName = req.body.event.broadcaster_user_name;
      const client = await connectToMongodb();
      const streamerCollection = new MongoDbBase(client, 'streamers');
      const streamerRepository = new StreamerRepository(streamerCollection);
      if (await streamerLiveTimeService.RunById(streamerRepository, streamerId)) {
        Client.channels.cache
          .get('775907977101180938')
          .send(`HI ALL!!! ${streamerName} 開台啦!\n https://www.twitch.tv/${streamerLoginName}`);
      }
      client.close();
    }
    const validMessage = 'this signature is valid';
    console.log(validMessage);
  }
  res.send(req.body);
});

app.get('/', (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
