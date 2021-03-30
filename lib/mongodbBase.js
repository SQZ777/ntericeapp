require('dotenv').config();

class MongoDbBase {
  constructor(mongodbClient, collectionName, dbName = 'discord') {
    this.collection = mongodbClient.db(dbName).collection(collectionName);
  }

  async closeDB() {
    await this.client.close();
  }

  async find(data) {
    const queryData = await this.collection.find(data).toArray();
    return queryData;
  }

  async findOneData(data) {
    const queryData = await this.collection.findOne(data);
    return queryData;
  }

  async insertData(data) {
    const result = await this.collection.insertOne(data);
    return result;
  }

  async deleteData(data) {
    await this.collection.deleteOne(data);
  }

  async updateData(query, data) {
    const result = await this.collection.updateOne(query, data);
    return result;
  }
}

module.exports = {
  MongoDbBase,
};
