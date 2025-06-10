const User = require("../Models/User");

const startTypingHandler = async (socket, data, io) => {
  console.log('START TYPING HANDLER CALLED');
  console.log('Received data:', data);
  console.log('Socket user:', socket.user);
  console.log('Socket user ID:', socket.user?.userId || socket.user?.id || socket.user?._id);
  
  const { userId, conversationId } = data;

  // Get the typing user's ID from socket.user
  const typingUserId = socket.user?.userId || socket.user?.id || socket.user?._id;
  
  if (!typingUserId) {
    console.error('No typing user ID found in socket.user:', socket.user);
    return;
  }

  // Fetch the target user by userId
  const user = await User.findById(userId);
  console.log('Target user found:', user ? (user.name || user._id) : 'Not found');
  console.log('Target user status:', user?.status);
  console.log('Target user socketId:', user?.socketId);

  if (user && user.status == "Online" && user.socketId) {
    const dataToSend = {
      conversationId,
      typing: true,
      typingUserId: typingUserId, // Now this will have a value
    };

    console.log('Emitting start-typing to:', user.socketId);
    console.log('Data being sent:', dataToSend);

    io.to(user.socketId).emit("start-typing", dataToSend);
    console.log('Start typing event emitted successfully');
  } else {
    console.log(`User with ID ${userId} is offline or not found`);
    console.log('Available user data:', {
      exists: !!user,
      status: user?.status,
      socketId: user?.socketId
    });
  }
};

module.exports = startTypingHandler;
