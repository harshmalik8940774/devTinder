const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hm8940774:Harshmalik137913@sampledatabase.s6mc7ac.mongodb.net/",
  );
};

connectDB()
  .then(() => {
    console.log("data base connection established");
  })
  .catch((err) => {
    console.log("database is not connected");
  });
