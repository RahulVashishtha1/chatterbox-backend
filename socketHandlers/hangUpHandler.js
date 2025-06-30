// Handler for when a user hangs up a call

const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const User = require("../Models/User");

function hangUpHandler(io, socket) {
  // When a user hangs up, notify both participants
  socket.on('call-hang-up', async ({ otherUserId, callType, conversationId }) => {
    console.log(`[Backend] Hang up from ${socket.userId} to other user ${otherUserId} (type: ${callType})`);
    // Notify both users
    io.to(otherUserId).emit('call-ended', {
      from: socket.userId,
      callType,
    });
    io.to(socket.userId).emit('call-ended', {
      from: socket.userId,
      callType,
    });

    // Only create a missed call message if the caller hangs up (not the receiver)
    // Assume socket.userId is the caller if they initiated the call
    try {
      if (conversationId) {
        // Create a system message for missed call
        const missedCallMsg = await Message.create({
          author: socket.userId,
          content: `Missed ${callType} call`,
          type: "System",
        });
        // Add to conversation
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.messages.push(missedCallMsg._id);
          await conversation.save();
        }
        // Populate author for frontend
        const populatedMsg = await Message.findById(missedCallMsg._id).populate("author", "name _id email").lean();
        // Emit to receiver and sender
        io.to(otherUserId).emit("missed_call_message", {
          conversationId,
          message: populatedMsg,
        });
        io.to(socket.userId).emit("missed_call_message", {
          conversationId,
          message: populatedMsg,
        });
      }
    } catch (err) {
      console.error("Error saving missed call message:", err);
    }
  });
}

module.exports = hangUpHandler; 