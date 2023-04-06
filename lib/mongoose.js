const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.mongoHost)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

const db = mongoose.connection;

module.exports = db;
