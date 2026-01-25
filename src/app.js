const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./modules/user");
const port = 3000;

// post api call to add user data into database

//express midleware to convert json data into js object and then store into req.body
app.use(express.json());

app.post("/signUp", async (req, res) => {
  // create a new instance of User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user " + err.message);
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
