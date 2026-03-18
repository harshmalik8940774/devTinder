const jwt = require("jsonwebtoken");
const User = require("../models/user");

const socketAuth = async (socket, next) => {
  try {
    // Read token from socket handshake
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Please Login!"));
    }

    // Validate the token
    const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const { _id } = decodeObj;
    const user = await User.findById(_id);

    if (!user) {
      return next(new Error("User not found"));
    }

    // Attach user to socket object
    socket.user = user;

    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};

module.exports = { socketAuth };
