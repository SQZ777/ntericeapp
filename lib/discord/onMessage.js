const apexSearchService = require('../APEX/apexSearchService');

const needHelpDict = [
  '自殺',
  '自杀',
  '跳樓',
  '跳楼',
  '憂鬱症',
  '忧鬱症',
  '忧鬱症',
  '忧郁症',
  '躁鬱症',
  '躁郁症',
];

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

async function isNeedCare(content) {
  for (let index = 0; index < needHelpDict.length; index += 1) {
    const element = needHelpDict[index];

    if (content.includes(element)) {
      return true;
    }
  }
  return false;
}

async function handleMessage(msg, voiceStateRecordRepository) {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
  if (msg.content.includes('上香')) {
    msg.channel.send('\\\\|/');
  }
  if (msg.author === '775930753069744130') {
    console.log('nonoo');
    console.log(msg.content);
  } else if ((await isNeedCare(msg.content)) && (await msg.author.id) !== '775930753069744130') {
    const careMsg = `張老師生命專線1980（依舊幫你）\n
    衛生福利部呼籲自殺防治需要全民的參與，如果遇到有想自殺、憂鬱的人，得以關心、陪伴，並協助將他轉介給專業的醫療人員。\n
    針對評估有自殺意圖者，透過資源連結轉介當地衛生局或醫療機構。`;
    await msg.reply(careMsg);
  }

  if (msg.content === '/誰啦') {
    if (msg.member.voice.channel !== null) {
      const result = await voiceStateRecordRepository.getRecord(msg.member.voice.channel.id);
      if (result) {
        for (let index = 0; index < result.length; index += 1) {
          const info = result[index];
          msg.reply(
            `最近 ${index + 1} 次進你頻道的是 ${info.userName}\n時間：${new Date(
              info.currentTime,
            ).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`,
          );
        }
      } else {
        msg.reply('...沒人啦 你聽錯了');
      }
    } else {
      msg.reply('沒在語音頻道裡是在問三小...');
    }
  }

  await dealWithApexSearchService(msg);
}

module.exports = {
  handleMessage,
};
