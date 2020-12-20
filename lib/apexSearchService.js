const { getRequest } = require('./request');
require('dotenv').config();

const PLATFORM = {
  XBOX: 1,
  PSN: 2,
  pc: 5,
};

async function getApexPlayerStatus(platform, playerName) {
  const platformNumber = PLATFORM[platform];
  const result = await getRequest({
    url: `https://public-api.tracker.gg/apex/v1/standard/profile/${platformNumber}/${playerName}`,
    headers: {
      'TRN-Api-Key': process.env.TRNApiKey,
    },
  });
  return result;
}

module.exports = {
  getApexPlayerStatus,
};
