const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7777;
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
//express midleware to convert json data into js object and then store into req.body
app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Express-Router
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("data base connection established");

    //firstly connect to database and then listen request from client side
    app.listen(port, () => {
      console.log("Server started running on port " + port);
    });
  })
  .catch((err) => {
    console.log("database is not connected");
  });
