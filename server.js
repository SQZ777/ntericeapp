const express = require('express');
const { MongoDbBase } = require('./lib/mongodbBase');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body); // your JSON
  res.send(req.body); // echo the result back
});

app.post('/streamer_notify', async (req, res) => {
  const testCollection = new MongoDbBase('test');
  await testCollection.connectMongo();
  await testCollection.updateData(
    { id: 1 },
    { $set: { context: req.body.user_name } },
  );
  res.send(req.body.user_name);
});

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
