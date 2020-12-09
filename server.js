const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body); // your JSON
  res.send(req.body); // echo the result back
});

app.post('/streamer_notify', (req, res) => {
  res.send(req.body.user_name);
});

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
