const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const socketServer = require("./socketServer");

const http = require("http"); //http comes built-in with nodejs
const server = http.createServer();

socketServer.registerSocketServer(server)

const PORT = process.env.PORT || process.env.API_PORT;

// console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection successful!");
    server.listen(PORT, () => {
      console.log(`Server is listeneing on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("database connection failed. Server not started");
    console.log(error);
  });
