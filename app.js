const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const Discord = require('discord.js');
const { MongoClient } = require('mongodb');
const { MongoDbBase } = require('./lib/mongodbBase');
const { StreamerRepository } = require('./lib/streamer/streamerRepository');

const Client = new Discord.Client();
const igotalldayService = require('./lib/igotallday/igotalldayYoutubeService');
const streamerLiveTimeService = require('./lib/streamer/streamerLiveTimeService');
const { requestToMyself } = require('./lib/requestMyself');
const { handleMessage } = require('./lib/discord/onMessage');

setInterval(() => {
  requestToMyself();
}, 600000);

function SignatureIsValid(req, broadcasterUserId) {
  const id = req.headers['twitch-eventsub-message-id'];
  const timestamp = req.headers['twitch-eventsub-message-timestamp'];
  const signature = req.headers['twitch-eventsub-message-signature'].split('=');

  const buf = Buffer.from(JSON.stringify(req.body));
  const calculatedSignature = crypto
    .createHmac(
      signature[0],
      `${broadcasterUserId}${process.env.twitchSubscribeSecret}`,
    )
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
  const igotalldayCollection = new MongoDbBase(client, 'igotallday');
  setInterval(async () => {
    await igotalldayService.run(Client, igotalldayCollection);
  }, 15000);
});

Client.on('message', async (msg) => {
  await handleMessage(msg);
});

Client.on('messageReactionAdd', async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching
    // might result in an API error, which we need to handle
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  if (reaction.message.content.includes(user.id) && reaction.emoji.name === '💩') {
    reaction.message.delete();
  }
  // Now the message has been cached and is fully available
  console.log(
    `${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`,
  );
  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(
    `${reaction.count} user(s) have given the same reaction to this message!`,
  );
});

Client.login(process.env.discordToken);

app.use(express.json());

app.post('/Twitch/CallBack', async (req, res) => {
  console.log(req.body);
  console.log(req.header('twitch-eventsub-message-signature'));
  console.log(req.header('Twitch-Eventsub-Message-Id'));
  console.log(req.header('Twitch-Eventsub-Message-Timestamp'));
  if (req.body.challenge) {
    if (
      SignatureIsValid(req, req.body.subscription.condition.broadcaster_user_id)
    ) {
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
      if (
        await streamerLiveTimeService.RunById(streamerRepository, streamerId)
      ) {
        Client.channels.cache
          .get('775907977101180938')
          .send(
            `HI ALL!!! ${streamerName} 開台啦!\n https://www.twitch.tv/${streamerLoginName}`,
          );
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
