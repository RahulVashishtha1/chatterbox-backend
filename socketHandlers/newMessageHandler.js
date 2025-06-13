const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const User = require("../Models/User");

const newMessageHandler = async (socket, data, io) => {
  console.log("New message data received:", JSON.stringify(data));
  console.log("Socket user:", socket.user);
  console.log("Socket ID:", socket.id);

  const { message, conversationId } = data;

  if (!conversationId) {
    console.error("Missing conversation ID in message data");
    return socket.emit("error", {
      status: "error",
      message: "Missing conversation ID",
    });
  }

  // Get the user ID from the socket
  const authorId = socket.user.userId;

  // Fetch the user to verify
  const user = await User.findById(authorId);
  console.log("Message sender user:", {
    id: user?._id,
    name: user?.name,
    email: user?.email,
  });

  // Extract message data
  const { content, media, audioUrl, document, type, giphyUrl } = message;

  // For media messages, ensure the media array is properly formatted
  let formattedMedia = media;
  if (type === "Media" && Array.isArray(media)) {
    formattedMedia = media.map((item) => ({
      type: item.type || "image",
      url: item.url,
    }));
    console.log("Formatted media data:", formattedMedia);
  }

  try {
    // Find the conversation - log the ID we're searching for
    console.log(`Looking for conversation with ID: ${conversationId}`);

    // Try to find the conversation with more flexible ID handling
    let conversation;

    // First try direct ID match
    conversation = await Conversation.findById(conversationId);

    // If not found, try string comparison (in case of ObjectId vs string issues)
    if (!conversation) {
      console.log("Direct ID lookup failed, trying string comparison...");
      conversation = await Conversation.find({}).then((convs) =>
        convs.find((c) => c._id.toString() === conversationId.toString())
      );
    }

    // If still not found, try to find by participants
    if (!conversation) {
      console.error(`Conversation not found with ID: ${conversationId}`);

      // Try to find conversation by participants
      conversation = await Conversation.findOne({
        participants: { $all: [authorId] },
      });

      if (conversation) {
        console.log(`Found alternative conversation: ${conversation._id}`);
        // Use this conversation instead
        console.log("Using alternative conversation for message");
      } else {
        return socket.emit("error", {
          status: "error",
          message: "Conversation not found!",
        });
      }
    }

    console.log("Found conversation:", {
      id: conversation._id,
      participants: conversation.participants,
    });

    // Create new message with the correct author ID
    const newMessage = await Message.create({
      author: authorId,
      content,
      media: formattedMedia,
      audioUrl,
      document,
      type,
      giphyUrl,
    });

    console.log("New message created:", newMessage);

    // Add message to conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Populate message with author details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("author", "name _id email")
      .lean();

    console.log("Populated message to send:", {
      id: populatedMessage._id,
      author: populatedMessage.author,
      authorName: populatedMessage.author?.name,
      type: populatedMessage.type,
    });

    // Create a room ID for this conversation
    const roomId = `conversation_${conversation._id}`;

    // Get all participants
    const participantUsers = await User.find({
      _id: { $in: conversation.participants },
    });

    // Join all participants to the room
    participantUsers.forEach((user) => {
      if (user.socketId) {
        socket.join(roomId);
      }
    });

    // Broadcast to the room (excluding sender)
    socket.to(roomId).emit("new-direct-chat", {
      conversationId: conversation._id,
      message: populatedMessage,
    });

    // Send success response to sender
    socket.emit("message-sent", {
      status: "success",
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Error handling new message:", error);
    socket.emit("error", {
      status: "error",
      message: "Error sending message",
      error: error.message,
    });
  }
};

module.exports = newMessageHandler;
