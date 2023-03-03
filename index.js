require("dotenv").config();
const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const userRouter = require('./routes/user.route')
const bookRouter = require('./routes/book.route')
const authorRouter = require('./routes/author.route')
const sagaRouter = require('./routes/saga.route')
const commentRouter = require('./routes/comment.route')

const app = express()

// connect to MongoDB
const connectDB = require("./db/connect");


// middlewares
app.use(errorHandler);
app.use(express.json());

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", bookRouter);
app.use("/api/v1", authorRouter);
app.use("/api/v1", sagaRouter);
app.use("/api/v1", commentRouter);

app.get('/', (req, res) => {
  res.send('This world 3')
})

app.get('/api/v1/hello', (req, res) => {
  res.status(200).json({status:'ok'})

})


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_KEY);
    console.log('connected');
    app.listen(port, console.log(`Server is listening port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
