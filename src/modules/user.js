const mongoose = require("mongoose");
const validator = require("validator");

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
      validatte(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validatte(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password " + value);
        }
      },
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
      validatte(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL " + value);
        }
      },
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
