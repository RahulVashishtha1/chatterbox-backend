const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (email) {
          return validator.isEmail(email);
        },
        message: (props) => `Email (${props.value}) is invalid!`,
      },
    },

    password: {
      type: String,
    },

    passwordChangedAt: {
      type: Date,
    },

    verified: {
      type: Boolean, // true, false
      default: false,
    },

    otp: {
      type: String,
    },
    otp_expiry_time: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
