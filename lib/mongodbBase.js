const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

class MongoDbBase {
    constructor(collection_name) {
        this.collection_name = collection_name;
    }

    async connectMongo() {
        this.client = await MongoClient.connect(process.env.mongoHost, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(err => {
            console.log(`something went wrong: ${err}`);
            throw err;
        });
        console.log('db connect success');
        this.collection = this.client.db('discord').collection(this.collection_name);
    }

    async closeDB() {
        this.client.close();
        console.log("closeDB success");
        return;
    };

    async findOneData(data) {
        const queryData = await this.collection.findOne(data);
        await console.log("qerry success");
        return queryData;
    };

    async insertData(data) {
        const result = await this.collection.insertOne(data);
        await console.log("Insert data sucess");
        return result;
    }

    async deleteData(data) {
        await this.collection.deleteOne(data);
        await console.log("Delete data sucess");
        return;
    }

    async updateData(query, data) {
        const result = await this.collection.updateOne(query, data);
        await console.log("Update data sucess");
        return result;
    }
}

module.exports = {
    MongoDbBase
}