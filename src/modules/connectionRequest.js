const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },

  {
    timestamps: true,
  },
);

//
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  // check if the  fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send connection request to yourself!");
  }
});

const connectionRequestModule = mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModule;
