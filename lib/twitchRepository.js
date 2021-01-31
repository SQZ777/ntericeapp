class TwitchRepository {
  constructor(mongoCollection) {
    this.mongoCollection = mongoCollection;
  }

  async getToken() {
    const queryData = await this.mongoCollection.findOneData({ Id: 1 });
    return queryData;
  }
}

module.exports = {
  TwitchRepository,
};
