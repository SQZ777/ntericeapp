require('dotenv').config();
const { getRequest } = require('../request');

async function getSubscriptions(authorization, type = 'stream.online') {
  const resp = await getRequest({
    url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
    headers: {
      Authorization: authorization,
      'Client-Id': process.env.twitchClientId,
    },
    json: true,
  });
  const result = [];
  console.log(resp.body);
  const subscriptions = resp.body.data;
  Object.values(subscriptions).forEach((subscription) => {
    if (subscription.type === type) {
      result.push(subscription.condition.broadcaster_user_id);
    }
  });
  return result;
}

module.exports = {
  getSubscriptions,
};
