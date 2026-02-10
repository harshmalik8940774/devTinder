const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

// Sending Connection Request API
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  //Send a connection request
  console.log("Send a connection request");

  res.send(user.firstName + "Send the connection request!");
});

module.exports = requestRouter;
