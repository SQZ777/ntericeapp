require('dotenv').config();
const { getRequest } = require('./request');

async function getChannelStatus(channelName) {
  const resp = await getRequest({
    url: `https://api.twitch.tv/helix/streams?user_login=${channelName}`,
    headers: {
      'Client-ID': process.env.twitchClientId,
      Authorization: process.env.twitchAuthorization,
    },
    json: true,
  });
  return resp.body.data[0];
}

async function getUser(userId) {
  const resp = await getRequest({
    url: `https://api.twitch.tv/helix/users?id=${userId}`,
    headers: {
      'Client-ID': process.env.twitchClientId,
      Authorization: process.env.twitchAuthorization,
    },
    json: true,
  });
  return resp.body.data[0];
}

module.exports = {
  getChannelStatus,
  getUser,
};
