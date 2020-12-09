const MongoDB = require('./mongodb');

async function getStreamer(streammerName) {
  const queryData = await MongoDB.findOneData({ name: streammerName });
  return queryData;
}

async function updateStreamerNotifyTime(streamerName, notifyTime = new Date()) {
  const queryData = await MongoDB.updateData(
    {
      name: streamerName,
    },
    {
      $set: {
        notifyTime,
      },
    },
  );
  return queryData;
}

async function updateStreamerStatus(streamerName, status) {
  const queryData = await MongoDB.updateData(
    {
      name: streamerName,
    },
    {
      $set: {
        status,
      },
    },
  );
  return queryData;
}

async function updateStreamerCloseTime(streamerName, closeTime = new Date()) {
  const queryData = await MongoDB.updateData(
    {
      name: streamerName,
    },
    {
      $set: {
        close_time: closeTime,
      },
    },
  );
  return queryData;
}

module.exports = {
  getStreamer,
  updateStreamerStatus,
  updateStreamerNotifyTime,
  updateStreamerCloseTime,
};
