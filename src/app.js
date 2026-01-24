const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./modules/user");
const port = 3000;

// post api call to add user data into database

app.post("/signUp", async (req, res) => {
  // create a new instance of User model
  const user = new User({
    firstName: "harsh",
    lastName: "malik",
    emailId: "xxxx",
    password: "yyy",
  });

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user " + err.message);
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
