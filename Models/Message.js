// author
// content
// media
// audioUrl
// document
// giphyUrl
// date
// type => Media | Text | Document | Audio | Giphy

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Text", "Media", "Document", "Giphy", "Audio", "System"],
      default: "Text",
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },
        url: String,
      },
    ],
    document: {
      url: String,
      name: String,
      size: Number,
    },
    giphyUrl: String,
    audioUrl: String,
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      readAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
