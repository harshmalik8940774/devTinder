const mongoose = require("mongoose");

//define user schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowerCase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      //Custom schema validation(for complex checks)
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not validate");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "http://xyx.png",
    },
    about: {
      type: String,
      default: "this is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timeStamps: true,
  },
);

//now create module of database
module.exports = mongoose.model("User", userSchema);
