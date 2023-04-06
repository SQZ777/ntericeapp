const { SlashCommandBuilder } = require('discord.js');
const apexLib = require('../../lib/APEX/apexSearchService');

module.exports = {
  data: new SlashCommandBuilder().setName('apexmap').setDescription('確認目前的 Apex 地圖; Check Apex current map.'),
  async execute(interaction) {
    await interaction.reply(await apexLib.getApexCurrentMap());
  },
};
