require('dotenv').config();
const {
    getRequest
} = require('./request');

async function get_channel_status(channel_name) {
    const resp = await getRequest({
        url: `https://api.twitch.tv/helix/streams?user_login=${channel_name}`,
        headers: {
            'Client-ID': process.env.twitchClientId,
            'Authorization': process.env.twitchAuthorization,
        },
        json: true,
    });
    return resp.body.data[0];
}

async function get_user(user_id) {
    const resp = await getRequest({
        url: `https://api.twitch.tv/helix/users?id=${user_id}`,
        headers: {
            'Client-ID': process.env.twitchClientId,
            'Authorization': process.env.twitchAuthorization,
        },
        json: true,
    });
    return resp.body.data[0];
}

module.exports = {
    get_channel_status,
    get_user
}

