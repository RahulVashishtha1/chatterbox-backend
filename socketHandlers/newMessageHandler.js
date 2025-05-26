const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");

const newMessageHandler = async (socket, data, io) => {
  console.log(data, "new-message");

  const { message, conversationId } = data;

  const { author, content, media, audioUrl, document, type, giphyUrl } =
    message;

  try {
    // 1. Find the conversation by conversationId
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return socket.emit("error", { message: "Conversation not found!" });
    }

    // 2. Create a new messageusing the message Model
    const newMessage = await Message.create({
      author,
      content,
      media,
      audioUrl,
      document,
      type,
      giphyUrl,
    });

    // 3. Push the messageId to the conversation messages array
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // 4. Populate the conversation with messages and participants
    const updatedConversation = await Conversation
      .findById(conversationId)
      .populate("messages")
      .populate("participants");

    // 5. Find the participants who are online (status === "Online") and have a socketId
    const onlineParticipants = updatedConversation.participants.filter(
      (participant) => participant.status === "Online" && participant.socketId
    );

    console.log(onlineParticipants);

    // 6. Populate the message author before sending
    const populatedMessage = await Message.findById(newMessage._id).populate('author', 'name _id');

    // 7. Emit the 'new-message' event to all online participants
    onlineParticipants.forEach((participant) => {
        console.log(participant.socketId);
        io.to(participant.socketId).emit('new-direct-chat', {
            conversationId: conversationId,
            message: populatedMessage,
        });
    })
  } catch (error) {
    console.error("Error handling new message:", error);
    socket.emit("error", { message: "Failed to send message" });
  }
};

module.exports = newMessageHandler;
