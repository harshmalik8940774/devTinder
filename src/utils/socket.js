const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

// Generate a unique room ID for two users using their user IDs
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

// Initialize Socket.IO server
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // Handle Socket.IO connections
  io.on("connection", (socket) => {
    // Listen for "joinChat" event to join a chat room
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // Join the user to a unique room based on their user IDs
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          //Check if userId & targetUserId are friends
          const isFriend = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });

          if (!isFriend) {
            return socket.emit(
              "errorMessage",
              "You can only message your friends",
            );
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          // Emit the message to all users in the room
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log(err);
          socket.emit("errorMessage", "Something went wrong");
        }
      },
    );
    // Handle disconnection
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
