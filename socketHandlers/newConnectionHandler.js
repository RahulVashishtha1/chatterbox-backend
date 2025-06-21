//

const User = require("../Models/User");
const Conversation = require("../Models/Conversation");

const newConnectionHandler = async (socket, io) => {
  const { userId } = socket.user;

  // Log new user connected
  console.log(`User connected: ${socket.id}, User ID: ${userId}`);

  try {
    // Log the socket's user ID
    console.log(`[Connection] New connection from socket ID: ${socket.id}, User ID: ${socket.userId}`);
    
    // Join a room with the user's ID
    if (socket.userId) {
      socket.join(socket.userId);
      console.log(`[Connection] Socket ${socket.id} joined room ${socket.userId}`);
    } else {
      console.log(`[Connection] Warning: Socket ${socket.id} connected without a userId.`);
    }

    // Add SocketId to user record and set status to online
    const user = await User.findByIdAndUpdate(
      userId,
      {
        socketId: socket.id,
        status: "Online",
      },
      {
        new: true,
        validateModifiedOnly: true,
      }
    );

    if (user) {
      console.log(`Updated user ${user.name} (${user._id}) with socket ID ${socket.id}`);
      
      // Find all conversations for this user
      const conversations = await Conversation.find({
        participants: userId
      });

      // Join all conversation rooms
      conversations.forEach(conversation => {
        const roomId = `conversation_${conversation._id}`;
        socket.join(roomId);
        console.log(`User ${user.name} joined room ${roomId}`);
      });
      
      // Broadcast to everyone the new user connected
      socket.broadcast.emit("user-connected", {
        message: `User ${user.name} has connected`,
        userId: user._id,
        status: "Online",
      });
    } else {
      console.log(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error("Error in newConnectionHandler:", error);
  }
};

module.exports = newConnectionHandler;
