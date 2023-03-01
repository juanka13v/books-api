require("dotenv").config();
const express = require('express')
const app = express()

// connect to MongoDB
const connectDB = require("./db/connect");



app.get('/', (req, res) => {
  res.send('This world')
})


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_KEY);
    app.listen(port, console.log(`Server is listening port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
