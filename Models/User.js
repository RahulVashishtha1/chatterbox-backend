const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
    },
    avatar: {
      type: String,
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
      unique: true,
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
    socketId: {
      type: String,
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  {
    timestamps: true,
  }
);

// PRE SAVE HOOK
userSchema.pre("save", async function (next) {
  // only run this function if otp is modified
  if (this.isModified("otp") && this.otp) {
    if(this.otp){
      // hash the otp with the cost of 12
    this.otp = await bcrypt.hash(this.otp.toString(), 12);

    console.log(this.otp.toString(), "FROM PRE SAVE HOOK");
    }
    
  }

  if (this.isModified("password") && this.password) {
    if(this.password){
        // hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password.toString(), 12);

    console.log(this.password.toString(), "FROM PRE SAVE HOOK");
    }
  
  }

  next();
});

// METHOD
userSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
  return await bcrypt.compare(candidateOTP, userOTP);
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
