const router = require('express').Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");
const friendRoutes = require("./friend");
const uploadRoutes = require("./upload");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/friends", friendRoutes);
router.use("/upload", uploadRoutes);

module.exports = router; 
