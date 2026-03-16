const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

//middlewares
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

//routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

//socket
const initializeSocket = require("./utils/socket");


// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// convert JSON request to JS object
app.use(express.json());


// cookie parser
app.use(cookieParser());


// request logger
app.use(logger);


// rate limiter (API protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);


// routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);


// global error handler
app.use(errorHandler);


// create HTTP server
const server = http.createServer(app);


// initialize socket
initializeSocket(server);


// database connection
connectDB()
  .then(() => {
    console.log("Database connection established");

    server.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });