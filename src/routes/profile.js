const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

//profileView-API
profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const client = req.app.locals.redisClient;
    const cacheKey = `profile:${req.user._id}`;

    let cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("✅ PROFILE CACHE HIT!");
      return res.send(JSON.parse(cachedData));
    }

    const user = req.user;

    await client.set(cacheKey, JSON.stringify(user), { EX: 300 });

    res.send(user);
  } catch (err) {
    // res.status(404).send("Error" + err.message);
    next(err); // Passes to global errorHandler
  }
});

//profileEdit-API
profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    //Data validatiion
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!");
    }

    //Update the profile of loggedIn User
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    // It is used to send res to the client in proper way
    res.json({
      message: `${loggedInUser.firstName}, Your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    // res.status(404).send("Error" + err.message);
    next(err); // Passes to global errorHandler
  }
});

// Forgot password API
profileRouter.patch("/profile/password", userAuth, async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const user = req.user;

    // Just update password
    user.password = await user.hashPassword(newPassword);
    // user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated!" });
  } catch (err) {
    next(err);
  }
});

module.exports = profileRouter;
