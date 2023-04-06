const fs = require('fs');
const path = require('path');

const {
  Client, Collection, Events, GatewayIntentBits,
} = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const { MongoClient } = require('mongodb');
const { VoiceStateRecordRepository } = require('./lib/discord/voiceStateRecordRepository');
const { MongoDbBase } = require('./lib/mongodbBase');

const { handleVoiceStateUpdate } = require('./lib/discord/voiceStateUpdate');

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
let voiceStateRecordCollection;
let voiceStateRecordRepository;
let mongodbConnetionFlag;

async function connectToMongodb() {
  const mongoClient = await MongoClient.connect(process.env.mongoHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(`something went wrong: ${err}`);
    throw err;
  });
  console.log('connect success.');
  return mongoClient;
}

commandFolders.forEach((folder) => {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  commandFiles.forEach((file) => {
    const filePath = path.join(commandsPath, file);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  });
});

client.on(Events.VoiceServerUpdate, async (oldState, newState) => {
  if (mongodbConnetionFlag) {
    handleVoiceStateUpdate(voiceStateRecordRepository, oldState, newState);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, async (c) => {
  const mongoClient = await connectToMongodb();
  mongodbConnetionFlag = true;
  voiceStateRecordCollection = new MongoDbBase(mongoClient, 'voiceStateRecord');
  voiceStateRecordRepository = new VoiceStateRecordRepository(voiceStateRecordCollection);
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.discordToken);
