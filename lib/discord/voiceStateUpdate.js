const { VoiceStateRecordRepository } = require('./voiceStateRecordRepository');

async function handleVoiceStateUpdate(voiceStateRecordCollection, oldState, newState) {
  const voiceStateRecordRepository = new VoiceStateRecordRepository(voiceStateRecordCollection);
  const currentTime = new Date();
  const record = {};
  record.currentTime = currentTime;
  if (oldState.channel !== null) {
    record.oldStateChannelName = oldState.channel.name;
    record.oldStateChannelId = oldState.channel.id;
  }
  if (newState.channel !== null) {
    record.newStateChannelName = newState.channel.name;
    record.newStateChannelId = newState.channel.id;
  }
  record.userId = oldState.member.user.id;
  record.userName = oldState.member.displayName;

  await voiceStateRecordRepository.createRecord(record);
}

module.exports = {
  handleVoiceStateUpdate,
};
