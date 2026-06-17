const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

//SignUp-API
authRouter.post("/signup", async (req, res, next) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
    });

    // Encrypt the password
    const passwordHash = await user.hashPassword(password);
    console.log(passwordHash);

    user.password = passwordHash;

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    // res.status(400).send("ERROR : " + err.message);
    next(err); // Passes to global errorHandler
  }
});

//Login - API
authRouter.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    // check whether the user is  present in DB

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create JWT  token
      const token = await user.getJWT();
      // const token = await jwt.sign({ _id: user._id }, "xyz", {
      //   expiresIn: "7d",
      // });
      console.log(token);
      // Add the token to the cookie and send the response to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    // res.status(400).send("Error" + err.message);
    next(err); // Passes to global errorHandler
  }
});

//Logout - API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
