const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//profile-API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // //read cookie from request
    // const cookies = req.cookies;
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(404).send("Error" + err.message);
  }
});

module.exports = profileRouter;
