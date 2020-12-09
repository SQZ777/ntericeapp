const { Discord } = require('discord.js');
const { postRequest } = require('./request');
const { MongoDB } = require('./mongodbIgotallday');

async function getLatestVideo() {
  const resp = await postRequest({
    url: 'https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
    'Content-Type': 'application/json',
    'Content-Length': 1636,
    body: {
      context: {
        client: {
          hl: 'zh-TW',
          gl: 'TW',
          visitorData: 'CgtoQmo3eHlralpjdyjFsu_9BQ%3D%3D',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36,gzip(gfe)',
          clientName: 'WEB',
          clientVersion: '2.20201120.01.00',
          osName: 'Windows',
          osVersion: '10.0',
          browserName: 'Chrome',
          browserVersion: '87.0.4280.66',
          screenWidthPoints: 1365,
          screenHeightPoints: 936,
          screenPixelDensity: 1,
          screenDensityFloat: 1,
          utcOffsetMinutes: 480,
          userInterfaceTheme: 'USER_INTERFACE_THEME_LIGHT',
          connectionType: 'CONN_CELLULAR_4G',
          mainAppWebInfo: {
            graftUrl: '/channel/UCzjNxGvrqfxL9KGkObbzrmg/videos',
          },
          timeZone: 'Asia/Taipei',
        },
        request: {
          sessionId: '6898303152463832106',
          internalExperimentFlags: [],
          consistencyTokenJars: [],
        },
        user: {},
        adSignalsInfo: {
          params: [
            {
              key: 'dt',
              value: '1606146373621',
            },
            {
              key: 'flash',
              value: '0',
            },
            {
              key: 'frm',
              value: '0',
            },
            {
              key: 'u_tz',
              value: '480',
            },
            {
              key: 'u_his',
              value: '3',
            },
            {
              key: 'u_java',
              value: 'false',
            },
            {
              key: 'u_h',
              value: '1080',
            },
            {
              key: 'u_w',
              value: '1920',
            },
            {
              key: 'u_ah',
              value: '1040',
            },
            {
              key: 'u_aw',
              value: '1920',
            },
            {
              key: 'u_cd',
              value: '24',
            },
            {
              key: 'u_nplug',
              value: '3',
            },
            {
              key: 'u_nmime',
              value: '4',
            },
            {
              key: 'bc',
              value: '31',
            },
            {
              key: 'bih',
              value: '936',
            },
            {
              key: 'biw',
              value: '1348',
            },
            {
              key: 'brdim',
              value: '0,0,0,0,1920,0,1920,1040,1365,936',
            },
            {
              key: 'vis',
              value: '1',
            },
            {
              key: 'wgl',
              value: 'true',
            },
            {
              key: 'ca_type',
              value: 'image',
            },
          ],
          bid:
            'ANyPxKojzBykCi3yHuqjZurYSu2wkucOyZeN4cSvmrRub7Rj8sDHqHwFtTOSfmX5SzNSh9tm6s2_otOHQGd_uF7QwgFCx_4LKQ',
        },
      },
      browseId: 'UCzjNxGvrqfxL9KGkObbzrmg',
      params: 'EgZ2aWRlb3M%3D',
    },
    json: true,
  });
  return resp.body.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer
    .content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
    .gridRenderer.items[0].gridVideoRenderer;
}

async function isVideoLatest(videoId) {
  const result = await MongoDB.findOneData({
    newest_video_id: videoId,
  });
  return result !== null;
}

async function getCurrentVideoId() {
  const result = await MongoDB.findOneData({
    id: 1,
  });
  return result.newest_video_id;
}

async function updateLatestVideo(oldVideoId, newVideoId) {
  const result = await MongoDB.updateData(
    {
      newest_video_id: oldVideoId,
    },
    {
      $set: {
        newest_video_id: newVideoId,
      },
    },
  );
  return result;
}

function getIgotalldayEmbded(video) {
  return new Discord.MessageEmbed()
    .setColor('#ff001a')
    .setTitle(video.title.runs[0].text)
    .setURL(`https://www.youtube.com/watch?v=${video.videoId}`)
    .setAuthor(
      '🚨🚨🚨 一級警報!!!!! 🚨🚨🚨',
      'https://yt3.ggpht.com/ytc/AAUvwngTztH-bT1CgpL9FwQWS1Mco0MFjXyu2zuNGnKg=s88-c-k-c0x00ffffff-no-rj',
      `https://www.youtube.com/watch?v=${video.videoId}`,
    )
    .setThumbnail(video.thumbnail.thumbnails[3].url)
    .setImage(video.thumbnail.thumbnails[3].url)
    .setTimestamp();
}

function sendMessage(client, messageContent) {
  client.channels.cache.get('775905509374558208').send(messageContent);
}

async function run(client) {
  const newVideo = await getLatestVideo();
  if (await isVideoLatest(newVideo.videoId)) {
    const currentVideoId = await getCurrentVideoId();
    await updateLatestVideo(currentVideoId, newVideo.videoId);
    sendMessage(client, getIgotalldayEmbded(newVideo));
  }
  return null;
}

module.exports = {
  run,
};