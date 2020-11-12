const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = process.env.mongoHost;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(async err => {
  const collection = await client.db("discord").collection("streamers");
  console.log(await collection.findOne({name: "attackfromtaiwan"}))
  client.close();
});
