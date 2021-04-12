const apexSearchService = require('../APEX/apexSearchService');

async function dealWithApexSearchService(msg) {
  const robotId = '775930753069744130';
  if (msg.author.id === robotId) {
    if (
      msg.content.includes('輸入格式為')
      || msg.content.includes('找不到')
      || msg.content.includes('的分數是')
    ) {
      msg.react('💩');
    }
  }
  await apexSearchService.run(msg);
}

async function handleMessage(msg) {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
  if (msg.content.includes('上香')) {
    msg.channel.send('\\\\|/');
  }
  await dealWithApexSearchService(msg);
}

module.exports = {
  handleMessage,
};
