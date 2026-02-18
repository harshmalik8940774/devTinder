const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from request cookie

    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid!!!");
    }

    //Validate the token
    const decodeObj = await jwt.verify(token, "xyz");

    //Find the user
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    //Now attach the user to request object
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("Error" + err.message);
  }
};

module.exports = { userAuth };
