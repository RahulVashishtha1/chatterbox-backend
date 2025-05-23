const catchAsync = require("../utilities/catchAsync");
const Conversation = require("../Models/Conversation");
const User = require("../Models/User");

// GET ME
exports.getMe = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: "success",
    message: "User Info found successfully!",
    data: {
      user,
    },
  });
});

// UPDATE ME
exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, jobTitle, bio, country } = req.body;
  const { _id } = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name: name,
      jobTitle,
      bio,
      country,
    },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "User Info updated successfully!",
    data: {
      user: updatedUser,
    },
  });
});

// UPDATE AVATAR
exports.updateAvatar = catchAsync(async (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatar,
    },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Avatar updated successfully!",
    data: {
      user: updatedUser,
    },
  });
});

// UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const { _id } = req.user;

  const user = await User.findById(_id).select("+password");

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return res.status(400).json({
      status: "error",
      message: "Your current password is wrong",
    });
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();

  await user.save({});

  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
  });
});

// GET USERS
exports.getUsers = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const other_verified_users = await User.find({
    _id: { $ne: _id },
    verified: true,
  }).select("name avatar _id status");

  // console.log("SENDING USERS DATA ->", other_verified_users);
  res.status(200).json({
    status: "success",
    message: "Users found successfully!",
    data: {
      users: other_verified_users,
    },
  });
});

// START CONVERSATION
exports.startConversation = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const { _id } = req.user; // the user starting the convo

  // Check if a conversation between those two users already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, _id] },
  })
    .populate("messages")
    .populate("participants");

  if (conversation) {
    return res.status(200).json({
      status: "success",
      data: {
        conversation,
      },
    });
  } else {
    //Create a new converation if no previous converation
    let newConversation = await Conversation.create({
      participants: [userId, _id],
    }); // can't write populate method on create method

    newConversation = await Conversation.findById(newConversation._id)
      .populate("messages")
      .populate("participants");

    return res.status(201).json({
      status: "success",
      data: {
        conversation: newConversation,
      },
    });
  }
});

// GET CONVERSATIONS
exports.getConversations = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  // Find all coversations where the current logged in user is a participant
  const conversations = await Conversation.find({
    participants: { $in: [_id] }, // $in is used to find all documents where the value of a field is in the specified array
  })
    .populate("messages")
    .populate("participants");

  // send the list of conversations as a response
  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});
