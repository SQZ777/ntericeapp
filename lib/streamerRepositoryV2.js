class StreamerRepositoryV2 {
  constructor(mongoCollection) {
    this.mongoCollection = mongoCollection;
  }

  async getStreamer(streammerName) {
    const queryData = await this.mongoCollection.findOneData({ name: streammerName });
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
      }
    );
    return queryData;
  }

  async updateStreamerStatus(streamerName, status) {
    const queryData = await this.mongoCollection.updateData(
      {
        name: streamerName,
      },
      {
        $set: {
          status,
        },
      }
    );
    return queryData;
  }

  async updateStreamerCloseTime(streamerName, closeTime = new Date()) {
    const queryData = await this.mongoCollection.updateData(
      {
        name: streamerName,
      },
      {
        $set: {
          close_time: closeTime,
        },
      }
    );
    return queryData;
  }
}

module.exports = {
  StreamerRepositoryV2
}