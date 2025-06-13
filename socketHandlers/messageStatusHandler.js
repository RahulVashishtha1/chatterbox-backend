const Message = require("../Models/Message");
const User = require("../Models/User");
const Conversation = require("../Models/Conversation");

const messageStatusHandler = async (socket, data, io) => {
  console.log("Message status update received:", data);
  const { messageId, conversationId, status } = data;

  try {
    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      console.error("Message not found:", messageId);
      return;
    }

    // Update message status
    message.status = status;

    // If status is "read", add user to readBy array if not already there
    if (status === "read") {
      const userId = socket.user.userId;
      const alreadyRead = message.readBy.some(read => read.user.toString() === userId);
      
      if (!alreadyRead) {
        message.readBy.push({
          user: userId,
          readAt: new Date()
        });
      }
    }

    // Save the updated message
    await message.save();

    // Get the conversation participants
    const conversation = await Conversation.findById(conversationId).populate('participants');
    if (!conversation) {
      console.error("Conversation not found:", conversationId);
      return;
    }

    // Broadcast status update to all participants
    conversation.participants.forEach(participant => {
      if (participant.socketId) {
        io.to(participant.socketId).emit('message-status-update', {
          messageId,
          conversationId,
          status,
          updatedAt: new Date()
        });
      }
    });

    console.log(`Message ${messageId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating message status:", error);
    socket.emit('error', {
      status: 'error',
      message: 'Failed to update message status'
    });
  }
};

// Handle message delivered event
const handleMessageDelivered = async (socket, data, io) => {
  console.log("Message delivered event received:", data);
  const { messageId, conversationId } = data;
  
  try {
    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      console.error("Message not found:", messageId);
      return;
    }

    // Update message status to delivered
    message.status = "delivered";
    await message.save();

    // Get the conversation participants
    const conversation = await Conversation.findById(conversationId).populate('participants');
    if (!conversation) {
      console.error("Conversation not found:", conversationId);
      return;
    }

    // Broadcast status update to all participants
    conversation.participants.forEach(participant => {
      if (participant.socketId) {
        io.to(participant.socketId).emit('message-status-update', {
          messageId,
          conversationId,
          status: "delivered",
          updatedAt: new Date()
        });
      }
    });

    console.log(`Message ${messageId} marked as delivered`);
  } catch (error) {
    console.error("Error marking message as delivered:", error);
    socket.emit('error', {
      status: 'error',
      message: 'Failed to mark message as delivered'
    });
  }
};

// Handle message read event
const handleMessageRead = async (socket, data, io) => {
  console.log("Message read event received:", data);
  const { messageId, conversationId } = data;
  
  try {
    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      console.error("Message not found:", messageId);
      return;
    }

    // Update message status to read
    message.status = "read";
    
    // Add user to readBy array if not already there
    const userId = socket.user.userId;
    const alreadyRead = message.readBy.some(read => read.user.toString() === userId);
    
    if (!alreadyRead) {
      message.readBy.push({
        user: userId,
        readAt: new Date()
      });
    }

    await message.save();

    // Get the conversation participants
    const conversation = await Conversation.findById(conversationId).populate('participants');
    if (!conversation) {
      console.error("Conversation not found:", conversationId);
      return;
    }

    // Broadcast status update to all participants
    conversation.participants.forEach(participant => {
      if (participant.socketId) {
        io.to(participant.socketId).emit('message-status-update', {
          messageId,
          conversationId,
          status: "read",
          updatedAt: new Date()
        });
      }
    });

    console.log(`Message ${messageId} marked as read`);
  } catch (error) {
    console.error("Error marking message as read:", error);
    socket.emit('error', {
      status: 'error',
      message: 'Failed to mark message as read'
    });
  }
};

module.exports = {
  messageStatusHandler,
  handleMessageDelivered,
  handleMessageRead
}; 