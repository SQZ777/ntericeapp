const { MongoClient } = require('mongodb');
require('dotenv').config();

class MongoDbBase {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async connectMongo() {
    this.client = await MongoClient.connect(process.env.mongoHost, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((err) => {
      console.log(`something went wrong: ${err}`);
      throw err;
    });
    console.log('db connect success');
    this.collection = this.client.db('discord').collection(this.collectionName);
  }

  async closeDB() {
    await this.client.close();
    console.log('closeDB success');
  }

  async findOneData(data) {
    const queryData = await this.collection.findOne(data);
    await console.log('qerry success');
    return queryData;
  }

  async insertData(data) {
    const result = await this.collection.insertOne(data);
    await console.log('Insert data sucess');
    return result;
  }

  async deleteData(data) {
    await this.collection.deleteOne(data);
    await console.log('Delete data sucess');
  }

  async updateData(query, data) {
    const result = await this.collection.updateOne(query, data);
    await console.log('Update data sucess');
    return result;
  }
}

module.exports = {
  MongoDbBase,
};
