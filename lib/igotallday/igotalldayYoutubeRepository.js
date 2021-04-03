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

  async getCurrentVideoId() {
    const result = await this.mongodbCollection.findOneData({
      id: 1,
    });
    return result.newest_video_id;
  }

  async updateLatestVideo(oldVideoId, newVideoId) {
    const result = await this.mongodbCollection.updateData(
      {
        newest_video_id: oldVideoId,
      },
      {
        $set: {
          newest_video_id: newVideoId,
        },
      },
    );
    return result;
  }
}

module.exports = {
  IgotalldayYoutubeRepository,
};
