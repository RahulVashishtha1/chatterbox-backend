const User = require("../Models/User");
const Conversation = require("../Models/Conversation");

const disconnectHandler = async (socket) => {
  // Log the disconnection
  console.log(`User disconnected: ${socket.id}`);

  try {
    // Update user document: Set socketId to undefined and status to Offline
    const user = await User.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: undefined, status: "Offline" },
      { new: true, validateModifiedOnly: true }
    );

    if (user) {
      // Find all conversations for this user
      const conversations = await Conversation.find({
        participants: user._id
      });

      // Leave all conversation rooms
      conversations.forEach(conversation => {
        const roomId = `conversation_${conversation._id}`;
        socket.leave(roomId);
        console.log(`User ${user.name} left room ${roomId}`);
      });

      // Broadcast to everyone except the disconnected user that the user has gone offline
      socket.broadcast.emit("user-disconnected", {
        message: `User ${user.name} has gone offline`,
        userId: user._id,
        status: "Offline",
      });
    } else {
      console.log(`User with Socket ID ${socket.id} not found`);
    }
  } catch (error) {
    console.error("Error in disconnectHandler:", error);
  }
};

module.exports = disconnectHandler;