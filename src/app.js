const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./modules/user");
const port = 3000;
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

// post api call to add user data into database

//express midleware to convert json data into js object and then store into req.body
app.use(express.json());

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

//Get user by email

app.get("/user", async (req, res) => {
  //fetch the email of user from client's request
  const userEmail = req.body.emailId;

  try {
    // return only one match document from DB
    // const user = await User.findOne({ emailId: userEmail });
    // if (!user) {
    //   res.status(404).send("user not found");
    // } else {
    //   res.send(user);
    // }

    // return array of all match documents from DB
    const users = await User.find({ emailId: userEmail });
    if (users.length == 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

//Feed API-  GET/feed - get all the users from DataBase
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

// Delete API-delete user from DB

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({_id:userId});
    const user = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

//Update data of user

app.patch("/user:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    //API-level Data sainitization
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
    //return data after update
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      //use for custom schema validator during update!
      runValidators: true,
    });
    //return data before update
    // const user = await User.findByIdAndUpdate(userId, data, {
    //   returnDocument: "before",
    // });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Update failed " + err.message);
  }
});
// //this request handler function is only handles GET call to /user
// app.get("/user", (req, res) => {
//   res.send({ firstName: "harsh", lastName: "malik" });
// });

// //this request handler function is only handles POST call to /user
// app.post("/user", (req, res) => {
//   console.log(req.body);
//   // saving data to db
//   res.send("data is successfully saved to database");
// });

// //this request handler function is only handles DELETE call to /user
// app.delete("/user", (req, res) => {
//   res.send("data is deleted");
// });

// //this will match all HTTPS method API calls to /main
// app.use("/main", (req, res) => {
//   res.send("another route");
// });

// // multiple route handlers

// app.use(
//   "/use",
//   (req, res, next) => {
//     //route handler

//     console.log("handling the route");
//     next();
//   },
//   (req, res, next) => {
//     res.send("second");
//   },
// );

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
