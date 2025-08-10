const jwt = require("jsonwebtoken");
require('../utils/loadEnv')();

const config = process.env;

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    socket.user = decoded;
    socket.userId = decoded.userId || decoded.id || decoded._id || decoded.user_id;
  } catch (err) {
    const socketError = new Error("NOT_AUTHORIZED");
    return next(socketError);
  }

  next();
};

module.exports = verifyTokenSocket;
