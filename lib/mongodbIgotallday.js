const { MongoClient } = require('mongodb');
require('dotenv').config();

async function connectMongo() {
  const client = await MongoClient.connect(process.env.mongoHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(`something went wrong: ${err}`);
    throw err;
  });

  console.log('db connect success');
  return {
    client,
    collection: client.db('discord').collection('igotallday'),
  };
}

async function closeDB(db) {
  db.close();
  console.log('closeDB success');
}

async function findOneData(data) {
  const db = await connectMongo();
  const collection = await db.collection;
  const queryData = await collection.findOne(data);
  await closeDB(db.client);
  await console.log('qerry success');
  return queryData;
}

async function insertData(data) {
  const db = await connectMongo();
  const collection = await db.collection;
  const result = await collection.insertOne(data);
  await console.log('Insert data sucess');
  await closeDB(db.client);
  return result;
}

async function deleteData(data) {
  const db = await connectMongo();
  const collection = await db.collection;
  await collection.deleteOne(data);
  await console.log('Delete data sucess');
  await closeDB(db.client);
}

async function updateData(query, data) {
  const db = await connectMongo();
  const collection = await db.collection;
  const result = await collection.updateOne(query, data);
  await console.log('Update data sucess');
  await closeDB(db.client);
  return result;
}

module.exports = {
  connectMongo,
  closeDB,
  insertData,
  findOneData,
  deleteData,
  updateData,
};
