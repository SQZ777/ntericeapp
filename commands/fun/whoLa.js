const { SlashCommandBuilder } = require('discord.js');

const { MongoClient } = require('mongodb');
const { VoiceStateRecordRepository } = require('../../lib/discord/voiceStateRecordRepository');
const { MongoDbBase } = require('../../lib/mongodbBase');

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('誰啦')
    .setDescription('查詢最近一次離開語音頻道的人; Check someone just leave.'),
  async execute(interaction) {
    if (interaction.member.voice.channel === null) {
      await interaction.reply('沒在語音頻道裡是在問三小...');
      return;
    }
    const voiceStateRecordCollection = new MongoDbBase(
      await connectToMongodb(),
      'voiceStateRecord',
    );
    const voiceStateRecordRepository = new VoiceStateRecordRepository(voiceStateRecordCollection);
    if (interaction.member.voice.channel !== null) {
      const result = await voiceStateRecordRepository.getRecord(
        interaction.member.voice.channel.id,
      );
      if (result.length === 0) {
        await interaction.reply('...沒人啦 你聽錯了');
      } else {
        await interaction.reply(
          `最近 1 次進你頻道的是 ${result[0].userName}\n時間：${new Date(
            result[0].currentTime,
          ).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`,
        );
      }
    }
    // await interaction.reply(await apexLib.getApexCurrentMap());
  },
};
