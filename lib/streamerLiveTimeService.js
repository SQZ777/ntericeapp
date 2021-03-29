async function GetStreamerLastOnLiveTime(streamerRepository, streamerName) {
  const streamer = await streamerRepository.getStreamer(streamerName);
  return streamer.notifyTime;
}

async function UpdateStreamerLiveTime(streamerRepository, streamerName) {
  const data = await streamerRepository.updateStreamerNotifyTime(streamerName);
  return data;
}

async function DiffLiveTimeIsAppropriate(streamerRepository, streamerName) {
  const lastOnLiveTime = await GetStreamerLastOnLiveTime(streamerRepository, streamerName);
  const diffTimeNow = Math.abs(new Date() - lastOnLiveTime) / 60000;
  return diffTimeNow >= 180;
}

async function Run(streamerRepository, streamerName) {
  const result = await DiffLiveTimeIsAppropriate(streamerRepository, streamerName);
  await UpdateStreamerLiveTime(streamerRepository, streamerName);
  return result;
}

module.exports = {
  Run,
};
