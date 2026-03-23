const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//Get all the pending request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    // req.statusCode(400).send("ERROR: " + err.message);
    next(err); // Passes to global errorHandler
  }
});

//Connection Request API
userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    //Modifying the data
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    // res.status(400).send({ message: err.message });
    next(err); // Passes to global errorHandler
  }
});

// User-Feed-API
userRouter.get("/feed", userAuth, async (req, res, next) => {
  try {
    //User should see all the other user cards except-
    //0. his own card
    //1. his connections
    //2. ignored peoples
    //3. already sent the connection request

    const client = req.app.locals.redisClient;
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const cacheKey = `feed:${loggedInUser._id}:p${page}:l${limit}`;

    //  CHECK CACHE FIRST
    let cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("FEED CACHE HIT!");
      return res.json({ data: JSON.parse(cachedData) });
    }

    //find all  connection requests (send+recieved)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId"); //select() is use to get only selected fields of documents in DB

    //Use set Data-structure to store the users_id which are not show to user's feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    //using query operators to get relevent data from DB
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    //  SAVE TO CACHE
    await client.set(cacheKey, JSON.stringify(users), { EX: 20 });

    res.json({ data: users });
  } catch (err) {
    // res.status(400).json({ message: err.message });
    next(err); // Passes to global errorHandler
  }
});
module.exports = userRouter;
