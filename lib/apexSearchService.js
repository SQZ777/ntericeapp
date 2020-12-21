const { getRequest } = require('./request');
require('dotenv').config();

const PLATFORM = {
  xbox: 1,
  psn: 2,
  pc: 5,
};

async function getApexPlayerStatus(platform, playerName) {
  const platformNumber = PLATFORM[platform.toLowerCase()];
  if (platformNumber === undefined) {
    return '平台格式輸入錯誤，目前支援的平台有： pc xbox psn';
  }
  const result = await getRequest({
    url: `https://public-api.tracker.gg/apex/v1/standard/profile/${platformNumber}/${playerName}`,
    headers: {
      'TRN-Api-Key': process.env.TRNApiKey,
    },
    json: true,
  });
  if (result.statusCode === 200) {
    for (let index = 0; index < result.body.data.stats.length; index += 1) {
      const element = result.body.data.stats[index];
      if (element.metadata.key === 'RankScore') {
        return `${playerName} 的分數是：${element.displayValue}`;
      }
    }
  }
  return `找不到 ${playerName} 的分數`;
}

async function run(msg) {
  const msgContent = msg.content;
  const command = msgContent.slice(0, 5).toLowerCase();
  const indexOf2ndSpace = msgContent.indexOf(' ', 6);
  const platform = msgContent.slice(6, indexOf2ndSpace);
  const playerName = msgContent.slice(indexOf2ndSpace + 1, msgContent.length);
  if (command === '/apex' && platform && playerName) {
    const playerStatusMsg = await getApexPlayerStatus(
      platform,
      playerName,
    );
    msg.reply(playerStatusMsg);
  } else if (command === '/apex') {
    msg.reply(
      '輸入格式為 /apex {查詢的平台} {玩家名稱}，請重新再試，查詢平台有 pc xbox psn',
    );
  }
}

module.exports = {
  run,
};
