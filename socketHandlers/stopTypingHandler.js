const User = require("../Models/User");

const stopTypingHandler = async (socket, data, io) => {
  const { userId, conversationId } = data;

  // This is the userId of the other participant in the conversation
  // who should recieve the typing status

  // Fetch the user by userId
  const user = await User.findById(userId);

  if (user && user.status == "Online" && user.socketId) {
    const dataToSend = {
      conversationId,
      typing: false,
      typingUserId: socket.userId, // Include who stopped typing
    };

    // Emit 'stop-typing' event to the socketId of the user
    io.to(user.socketId).emit("stop-typing", dataToSend);
  } else {
    // User is offline, don't emit any event
    console.log(
      `User with ID ${userId} is offline. Not emitting typing status`
    );
  }
};

module.exports = stopTypingHandler;
