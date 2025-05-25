const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for performance (non-unique to allow multiple requests over time)
requestSchema.index({ sender: 1, recipient: 1 });
requestSchema.index({ status: 1 });

const FriendRequest = mongoose.model("FriendRequest", requestSchema);
module.exports = FriendRequest;
