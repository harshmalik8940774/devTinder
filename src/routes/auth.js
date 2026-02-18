const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

//SignUp-API
authRouter.post("/signUp", async (req, res) => {
  //Validation of data
  validateSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

  //Encrypt the password

  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  // create a new instance of User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user " + err.message);
  }
});

//Login - API
authRouter.post("/login", async (req, res) => {
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
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error" + err.message);
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
