// should insert data:
// { voiceChannelName, joinTime, leaveTime, userId, userDisplayName}

class VoiceStateRecordRepository {
  constructor(mongodbCollection) {
    this.mongodbCollection = mongodbCollection;
  }

  async createRecord(voiceStateInfo) {
    console.log(`insert data into mongodb: ${JSON.stringify(voiceStateInfo)}`);
    const queryData = await this.mongodbCollection.insertData(voiceStateInfo);
    return queryData.insertedCount;
  }

  async getRecord(channelId, limitCount = 2) {
    const result = await this.mongodbCollection.findWithLimit(
      { oldStateChannelId: channelId },
      limitCount,
    );
    return result;
  }
}

module.exports = {
  VoiceStateRecordRepository,
};
