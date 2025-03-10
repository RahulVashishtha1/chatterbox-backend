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

    // newConnectionHandler
  });

  setInterval(() => {
    // emit online user
  }, [1000 * 8]);
};

module.exports = {registerSocketServer};