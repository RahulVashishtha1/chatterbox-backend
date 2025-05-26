const Conversation = require("../Models/Conversation");

const chatHistoryHandler = async (socket, data) => {
  try {
    // Conversation ID
    const { conversationId } = data;

    console.log(data, "conversation Id");

    // Find the conversation by ID and populate the messages with author details
    const conversation = await Conversation.findById(conversationId)
      .select("messages")
      .populate({
        path: "messages",
        populate: {
          path: "author",
          select: "name _id"
        }
      });

    if (!conversation) {
      return socket.emit("error", { message: "Conversation not found" });
    }

    // Prepare the response data
    const res_data = {
      conversationId,
      history: conversation.messages,
    };

    // Emit the chat history back to same socket

    socket.emit("chat-history", res_data);
  } catch (error) {
    // Handle any errors and send error event back
    socket.emit("error", { message: "Failed to fetch chat history", error });
  }
};

module.exports = chatHistoryHandler;
