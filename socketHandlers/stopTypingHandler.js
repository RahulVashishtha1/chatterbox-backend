const User = require("../Models/User");

const stopTypingHandler = async (socket, data, io) => {
  console.log('STOP TYPING HANDLER CALLED');
  console.log(' Received data:', data);
  
  const { userId, conversationId } = data;

  // Get the typing user's ID from socket.user
  const typingUserId = socket.user?.userId || socket.user?.id || socket.user?._id;
  
  if (!typingUserId) {
    console.error('No typing user ID found in socket.user:', socket.user);
    return;
  }

  // Fetch the target user by userId
  const user = await User.findById(userId);

  if (user && user.status == "Online" && user.socketId) {
    const dataToSend = {
      conversationId,
      typing: false,
      typingUserId: typingUserId, // Now this will have a value
    };

    console.log('Emitting stop-typing to:', user.socketId);
    console.log(' Data being sent:', dataToSend);

    io.to(user.socketId).emit("stop-typing", dataToSend);
    console.log('Stop typing event emitted successfully');
  } else {
    console.log(`User with ID ${userId} is offline`);
  }
};

module.exports = stopTypingHandler;
