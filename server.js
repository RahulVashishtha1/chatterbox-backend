const app = require("./app");
const express = require("express");
const path = require("path");

// Unified environment loader
require('./utils/loadEnv')();

const mongoose = require("mongoose");
const socketServer = require("./socketServer");

const http = require("http"); //http comes built-in with nodejs
const server = http.createServer(app);

socketServer.registerSocketServer(server)

const PORT = process.env.PORT || process.env.API_PORT || 8000;
console.log("Allowed CORS Origin:", process.env.CORS_ORIGIN || "*");


// Import upload routes
const uploadRoutes = require('./routes/upload');

// Register upload routes
app.use('/api/upload', uploadRoutes);

// uploads static is handled in app.js for dev only

// Add CORS headers for file access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});


// console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection successful!");
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("database connection failed. Server not started");
    console.log(error);
  });
