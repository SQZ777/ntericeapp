const { getRequest } = require('./request');
require('dotenv').config();

const PLATFORM = {
  xbox: 1,
  psn: 2,
  pc: 5,
};

async function getApexPlayerStatus(platform, playerName) {
  const platformNumber = PLATFORM[platform.toLowerCase()];
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

module.exports = {
  getApexPlayerStatus,
};
