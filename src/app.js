const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./modules/user");
const port = 3000;
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middlewares/auth");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// post api call to add user data into database

//express midleware to convert json data into js object and then store into req.body
app.use(express.json());

//SignUp-API
app.post("/signUp", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//profile-API
app.get("/profile", userAuth, async (req, res) => {
  try {
    // //read cookie from request
    // const cookies = req.cookies;
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(404).send("Error" + err.message);
  }
});

// Sending Connection Request API
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  //Send a connection request
  console.log("Send a connection request");

  res.send(user.firstName + "Send the connection request!");
});

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
