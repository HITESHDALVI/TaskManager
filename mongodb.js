const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const mongoose = require("mongoose");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const collection = process.env.collection;
const mongo_url = process.env.MONGO_URL;

mongoose
  .connect(mongo_url, {
    dbName: dbName,
  })
  .then(() => [console.log("connecteed to db ")])
  .catch((err) => {
    console.log({ err });
  });
// module.exports = dbConnect = async () => {
//   let result = await client.connect();
//   let database = result.db("local");
//   console.log({ database });
//   return database.collection(collection);
// };
