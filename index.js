require("dotenv").config();
require("express-async-errors");
const express = require("express");
const fileUpload = require("express-fileupload");
const { MONGO_KEY, PORT } = require("./config");

const authUser = require("./middlewares/authentication");

const userRouter = require("./routes/user.route");
const bookRouter = require("./routes/book.route");
const authorRouter = require("./routes/author.route");
const sagaRouter = require("./routes/saga.route");
const commentRouter = require("./routes/comment.route");
const authRouter = require("./routes/auth.route");
const categoryRouter = require("./routes/category.route");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const app = express();

// connect to MongoDB
const connectDB = require("./db/connect");

// middlewares
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", bookRouter);
app.use("/api/v1", authorRouter);
app.use("/api/v1", sagaRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", authUser, commentRouter);

app.get("/", (req, res) => {
  res.send("Books api");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = PORT;

const start = async () => {
  try {
    // connectDB
    await connectDB(MONGO_KEY);
    console.log("connected");
    app.listen(port, console.log(`Server is listening port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
