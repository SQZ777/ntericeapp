class StreamerRepository {
  constructor(mongoCollection) {
    this.mongoCollection = mongoCollection;
  }

  async getStreamers() {
    const queryData = await this.mongoCollection.find({});
    return queryData;
  }

  async getStreamer(streamerName) {
    const queryData = await this.mongoCollection.findOneData({
      name: streamerName,
    });
    return queryData;
  }

  async getStreamerById(streamerId) {
    const queryData = await this.mongoCollection.findOneData({
      twitch_user_id: streamerId,
    });
    return queryData;
  }

  async updateStreamerNotifyTime(streamerName, notifyTime = new Date()) {
    const queryData = await this.mongoCollection.updateData(
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

  async updateStreamerNotifyTimeById(streamerId, notifyTime = new Date()) {
    const queryData = await this.mongoCollection.updateData(
      {
        twitch_user_id: streamerId,
      },
      {
        $set: {
          notifyTime,
        },
      },
    );
    return queryData;
  }

  // will be deprecated
  async updateStreamerStatus(streamerName, status) {
    const queryData = await this.mongoCollection.updateData(
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

  // will be deprecated
  async updateStreamerCloseTime(streamerName, closeTime = new Date()) {
    const queryData = await this.mongoCollection.updateData(
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
}

module.exports = {
  StreamerRepository,
};
