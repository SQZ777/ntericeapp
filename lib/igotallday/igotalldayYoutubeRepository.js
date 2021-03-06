class IgotalldayYoutubeRepository {
  constructor(mongodbCollection) {
    this.mongodbCollection = mongodbCollection;
  }

  async isVideoLatest(videoId) {
    const result = await this.mongodbCollection.findOneData({
      newest_video_id: videoId,
    });
    return result === null;
  }

  async getCurrentVideo() {
    const result = await this.mongodbCollection.findOneData({
      id: 1,
    });
    return result;
  }

  async getCurrentVideoStatus() {
    const result = await this.mongodbCollection.findOneData({
      id: 1,
    });
    return result;
  }

  async updateLatestVideo(oldVideoId, newVideoId) {
    const result = await this.mongodbCollection.updateData(
      {
        newest_video_id: oldVideoId,
      },
      {
        $set: {
          newest_video_id: newVideoId,
          update_time: new Date(),
        },
      },
    );
    return result;
  }
}

module.exports = {
  IgotalldayYoutubeRepository,
};
