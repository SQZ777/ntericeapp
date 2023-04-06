const { getRequest } = require('../request');
require('dotenv').config();

const PLATFORM = {
  xbox: 1,
  psn: 2,
  pc: 5,
};

const MAPS = {
  'Storm Point': '暴風點',
  "World's Edge": '世界邊緣',
  'Kings Canyon': '王者峽谷',
  Olympus: '奧林匹斯',
  'Broken Moon': '破碎之月',
};

async function getApexPlayerStatus(platform, playerName) {
  const result = await getRequest({
    url: `https://public-api.tracker.gg/apex/v1/standard/profile/${platform}/${playerName}`,
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

async function getApexCurrentMap() {
  const result = await getRequest({
    url: `https://api.mozambiquehe.re/maprotation?auth=${process.env.APEXStatusApiKey}`,
  });
  const parsedResult = JSON.parse(result.body);
  if (result.statusCode === 200) {
    const currentMap = parsedResult.current;
    const nextMap = parsedResult.next;
    return `目前的地圖是：${MAPS[currentMap.map]}, 地圖剩餘時間：${
      currentMap.remainingTimer
    }\n下一張地圖是：${MAPS[nextMap.map]}`;
  }
  return '目前無法查詢，找 Ice 處理ㄅ';
}
async function run(msg) {
  const msgContent = msg.content;
  const splitedMsgs = msgContent.split(' ');
  const command = splitedMsgs[0];
  const platform = splitedMsgs[1];
  const playerName = splitedMsgs[2] === undefined ? splitedMsgs[1] : splitedMsgs[2];
  if (command === '/apexmap') {
    const currentMapInfo = await getApexCurrentMap();
    msg.reply(currentMapInfo);
    return;
  }

  if (command === '/apex') {
    // ```
    // /apex {platform} {playerName}
    // default platform is pc(5), when no input with platform
    // ```
    let platformNumber = 5;
    if (PLATFORM[platform.toLowerCase()]) {
      platformNumber = PLATFORM[platform.toLowerCase()];
    }
    console.log(`Searching APEX player: ${playerName}`);
    const playerStatusMsg = await getApexPlayerStatus(platformNumber, playerName);
    console.log('Search complete');
    msg.reply(playerStatusMsg);
  }
}

module.exports = {
  run,
  getApexCurrentMap,
  getApexPlayerStatus,
};
