const apexSearchService = require('../APEX/apexSearchService');

async function handleMessage(msg) {
  const robotId = '775930753069744130';
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
  if (msg.content.includes('上香')) {
    msg.channel.send('\\\\|/');
  }
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

module.exports = {
  handleMessage,
};
