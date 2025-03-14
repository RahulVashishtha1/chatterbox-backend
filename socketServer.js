const authSocket = require("./middleware/authSocket");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      method: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  io.on("connection", (socket) => {
    console.log("User connected.");
    console.log(socket.id);

    // TODO: newConnectionHandler

    // TODO: disconnectHandler
    socket.on("disconnect", () => {});

    // TODO: newMessageHandler
    socket.on("new-message", (data) => {});

    // TODO: chatHistoryHandler
    socket.on("direct-chat-history", (data) => {});

    // TODO: startTypingHandler
    socket.on("start-typing", (data) => {});

    // TODO: stopTypingHandler
    socket.on("stop-typing", (data) => {});
  });
};

module.exports = { registerSocketServer };
