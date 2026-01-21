const express = require("express");
const app = express();
const port = 3000;

//this request handler function is only handles GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "harsh", lastName: "malik" });
});

//this request handler function is only handles POST call to /user
app.post("/user", (req, res) => {
  console.log(req.body);
  // saving data to db
  res.send("data is successfully saved to database");
});

//this request handler function is only handles DELETE call to /user
app.delete("/user", (req, res) => {
  res.send("data is deleted");
});

//this will match all HTTPS method API calls to /main
app.use("/main", (req, res) => {
  res.send("another route");
});

// multiple route handlers

app.use(
  "/use",
  (req, res, next) => {
    //route handler

    console.log("handling the route");
    next();
  },
  (req, res, next) => {
    res.send("second");
  },
);

app.listen(port, () => {
  console.log("Server started running on port " + port);
});
