const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect("mongodb+srv://admin:TiQt8NHT8Qf3w1Rt@cluster0.0tvmiff.mongodb.net/", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  console.log('Mongodb connected');
};

module.exports = connectDB;
