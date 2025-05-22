const User = require("../Models/User");
const FriendRequest = require("../Models/FriendRequest");
const catchAsync = require("../utilities/catchAsync");

// Send friend request
exports.sendFriendRequest = catchAsync(async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user._id;

  // Check if users exist
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({
      status: "error",
      message: "Recipient user not found"
    });
  }

  // Check if sender and recipient are the same
  if (senderId.toString() === recipientId) {
    return res.status(400).json({
      status: "error",
      message: "You cannot send a friend request to yourself"
    });
  }

  // Check if they are already friends
  const sender = await User.findById(senderId);
  if (sender.friends.includes(recipientId)) {
    return res.status(400).json({
      status: "error",
      message: "You are already friends with this user"
    });
  }

  // Check if a request already exists
  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId }
    ]
  });

  if (existingRequest) {
    return res.status(400).json({
      status: "error",
      message: "A friend request already exists between these users",
      requestStatus: existingRequest.status
    });
  }

  // Create new friend request
  const friendRequest = await FriendRequest.create({
    sender: senderId,
    recipient: recipientId
  });

  // Populate sender details for the response
  const populatedRequest = await FriendRequest.findById(friendRequest._id)
    .populate('sender', 'name avatar status')
    .populate('recipient', 'name avatar status');

  res.status(201).json({
    status: "success",
    message: "Friend request sent successfully",
    data: {
      request: populatedRequest
    }
  });
});

// Get all friend requests for current user
exports.getFriendRequests = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Find all requests where user is recipient and status is pending
  const incomingRequests = await FriendRequest.find({
    recipient: userId,
    status: "pending"
  })
    .populate('sender', 'name avatar status')
    .populate('recipient', 'name avatar status');

  // Find all requests where user is sender
  const outgoingRequests = await FriendRequest.find({
    sender: userId
  })
    .populate('sender', 'name avatar status')
    .populate('recipient', 'name avatar status');

  res.status(200).json({
    status: "success",
    data: {
      incoming: incomingRequests,
      outgoing: outgoingRequests
    }
  });
});

// Accept friend request
exports.acceptFriendRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;

  // Find the request
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({
      status: "error",
      message: "Friend request not found"
    });
  }

  // Check if user is the recipient
  if (request.recipient.toString() !== userId.toString()) {
    return res.status(403).json({
      status: "error",
      message: "You can only accept requests sent to you"
    });
  }

  // Check if request is pending
  if (request.status !== "pending") {
    return res.status(400).json({
      status: "error",
      message: `Request has already been ${request.status}`
    });
  }

  // Update request status
  request.status = "accepted";
  await request.save();

  // Add each user to the other's friends list
  await User.findByIdAndUpdate(
    request.sender,
    { $addToSet: { friends: request.recipient } }
  );

  await User.findByIdAndUpdate(
    request.recipient,
    { $addToSet: { friends: request.sender } }
  );

  // Populate the response
  const populatedRequest = await FriendRequest.findById(requestId)
    .populate('sender', 'name avatar status')
    .populate('recipient', 'name avatar status');

  res.status(200).json({
    status: "success",
    message: "Friend request accepted",
    data: {
      request: populatedRequest
    }
  });
});

// Reject friend request
exports.rejectFriendRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;

  // Find the request
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({
      status: "error",
      message: "Friend request not found"
    });
  }

  // Check if user is the recipient
  if (request.recipient.toString() !== userId.toString()) {
    return res.status(403).json({
      status: "error",
      message: "You can only reject requests sent to you"
    });
  }

  // Check if request is pending
  if (request.status !== "pending") {
    return res.status(400).json({
      status: "error",
      message: `Request has already been ${request.status}`
    });
  }

  // Update request status
  request.status = "rejected";
  await request.save();

  // Populate the response
  const populatedRequest = await FriendRequest.findById(requestId)
    .populate('sender', 'name avatar status')
    .populate('recipient', 'name avatar status');

  res.status(200).json({
    status: "success",
    message: "Friend request rejected",
    data: {
      request: populatedRequest
    }
  });
});

// Cancel friend request (sender cancels their own request)
exports.cancelFriendRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;

  // Find the request
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({
      status: "error",
      message: "Friend request not found"
    });
  }

  // Check if user is the sender
  if (request.sender.toString() !== userId.toString()) {
    return res.status(403).json({
      status: "error",
      message: "You can only cancel requests you've sent"
    });
  }

  // Check if request is pending
  if (request.status !== "pending") {
    return res.status(400).json({
      status: "error",
      message: `Request has already been ${request.status}`
    });
  }

  // Delete the request
  await FriendRequest.findByIdAndDelete(requestId);

  res.status(200).json({
    status: "success",
    message: "Friend request cancelled"
  });
});

// Get all friends
exports.getFriends = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Find the user and populate friends
  const user = await User.findById(userId).populate('friends', 'name avatar status');

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found"
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      friends: user.friends
    }
  });
});

// Remove friend
exports.removeFriend = catchAsync(async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user._id;

  // Check if friend exists
  const friend = await User.findById(friendId);
  if (!friend) {
    return res.status(404).json({
      status: "error",
      message: "Friend not found"
    });
  }

  // Remove friend from user's friends list
  await User.findByIdAndUpdate(
    userId,
    { $pull: { friends: friendId } }
  );

  // Remove user from friend's friends list
  await User.findByIdAndUpdate(
    friendId,
    { $pull: { friends: userId } }
  );

  res.status(200).json({
    status: "success",
    message: "Friend removed successfully"
  });
});