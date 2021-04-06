require('dotenv').config();
const { getRequest } = require('../request');

async function getUserWithLogin(userId, authorization) {
  const resp = await getRequest({
    url: `https://api.twitch.tv/helix/users?login=${userId}`,
    headers: {
      Authorization: authorization,
      'Client-Id': process.env.twitchClientId,
    },
    json: true,
  });
  return resp.body;
}

module.exports = {
  getUserWithLogin,
};
