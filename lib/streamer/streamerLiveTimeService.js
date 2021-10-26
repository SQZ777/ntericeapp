async function GetStreamerLastOnLiveTimeById(streamerRepository, streamerId) {
  const streamer = await streamerRepository.getStreamerById(streamerId);
  return streamer.notifyTime;
}

async function UpdateStreamerLiveTimeById(streamerRepository, streamerId) {
  const data = await streamerRepository.updateStreamerNotifyTimeById(streamerId);
  return data;
}

async function DiffLiveTimeIsAppropriateById(streamerRepository, streamerId) {
  const lastOnLiveTime = await GetStreamerLastOnLiveTimeById(streamerRepository, streamerId);
  const diffTimeNow = Math.abs(new Date() - lastOnLiveTime) / 60000;
  return diffTimeNow >= 480;
}

async function RunById(streamerRepository, streamerId) {
  const result = await DiffLiveTimeIsAppropriateById(streamerRepository, streamerId);
  await UpdateStreamerLiveTimeById(streamerRepository, streamerId);
  return result;
}

async function GetStreamerLastOnLiveTime(streamerRepository, streamerName) {
  const streamer = await streamerRepository.getStreamer(streamerName);
  return streamer.notifyTime;
}

async function DiffLiveTimeIsAppropriate(streamerRepository, streamerName) {
  const lastOnLiveTime = await GetStreamerLastOnLiveTime(streamerRepository, streamerName);
  const diffTimeNow = Math.abs(new Date() - lastOnLiveTime) / 60000;
  return diffTimeNow >= 480;
}

async function UpdateStreamerLiveTime(streamerRepository, streamerName) {
  const data = await streamerRepository.updateStreamerNotifyTime(streamerName);
  return data;
}

async function Run(streamerRepository, streamerName) {
  const result = await DiffLiveTimeIsAppropriate(streamerRepository, streamerName);
  await UpdateStreamerLiveTime(streamerRepository, streamerName);
  return result;
}

module.exports = {
  Run, // will be deprecated
  RunById,
};
