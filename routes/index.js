const router = require('express').Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");
const friendRoutes = require("./friend");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/friends", friendRoutes);

module.exports = router; 
