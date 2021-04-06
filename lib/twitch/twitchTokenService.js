require('dotenv').config();
const { postRequest } = require('../request');

async function getNewAccessToken() {
  const clientSecret = process.env.twitchClientSecret;
  const clientId = process.env.twitchClientId;
  const resp = await postRequest({
    url: `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    json: true,
  });
  return resp.body.access_token;
}

module.exports = {
  getNewAccessToken,
};
