const authSocket = require("./middleware/authSocket");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const chatHistoryHandler = require("./socketHandlers/getMessageHistoryHandler");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const newMessageHandler = require("./socketHandlers/newMessageHandler");
const startTypingHandler = require("./socketHandlers/startTypingHandler");
const stopTypingHandler = require("./socketHandlers/stopTypingHandler");
const { messageStatusHandler, handleMessageDelivered, handleMessageRead } = require("./socketHandlers/messageStatusHandler");
const callHandler = require("./socketHandlers/callHandler");
const callRejectedHandler = require("./socketHandlers/callRejectedHandler");
const hangUpHandler = require("./socketHandlers/hangUpHandler");

const registerSocketServer = (server) => {
  const allowedOrigin = process.env.CORS_ORIGIN || "*"; // e.g., https://your-frontend.vercel.app
  const io = require("socket.io")(server, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  io.on("connection", (socket) => {
    console.log("User connected.");
    console.log(socket.id);

    // ** DONE => newConnectionHandler
    newConnectionHandler(socket, io);

    // ** DONE => disconnectHandler
    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });

    // ** DONE => newMessageHandler
    socket.on("new-message", (data) => {
      newMessageHandler(socket, data, io);
    });

    // ** DONE => chatHistoryHandler
    socket.on("direct-chat-history", (data) => {
      chatHistoryHandler(socket, data);
    });

    // ** DONE => startTypingHandler
    socket.on("start-typing", (data) => {
      startTypingHandler(socket, data, io);
    });

    // ** DONE => stopTypingHandler
    socket.on("stop-typing", (data) => {
      stopTypingHandler(socket, data, io);
    });

    // ** DONE => message status handlers
    socket.on("message-status-update", (data) => {
      messageStatusHandler(socket, data, io);
    });

    socket.on("message-delivered", (data) => {
      handleMessageDelivered(socket, data, io);
    });

    socket.on("message-read", (data) => {
      handleMessageRead(socket, data, io);
    });

    // Register call signaling handler (audio & video)
    callHandler(io, socket);
    callRejectedHandler(io, socket);
    hangUpHandler(io, socket);
  });
};

module.exports = { registerSocketServer };
