class TwitchRepository {
  constructor(mongoCollection) {
    this.mongoCollection = mongoCollection;
  }

  async getAuthorization() {
    const queryData = await this.mongoCollection.findOneData({ id: 1 });
    return queryData.Authorization;
  }

  async getClientId() {
    const queryData = await this.mongoCollection.findOneData({ id: 1 });
    return queryData.ClientId;
  }
}

module.exports = {
  TwitchRepository,
};
