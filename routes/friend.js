const router = require("express").Router();
const authController = require("../controllers/authController");
const friendController = require("../controllers/friendController");

// Protect all routes
router.use(authController.protect);

// Friend request routes
router.post("/send-request", friendController.sendFriendRequest);
router.get("/requests", friendController.getFriendRequests);
router.patch("/accept/:requestId", friendController.acceptFriendRequest);
router.patch("/reject/:requestId", friendController.rejectFriendRequest);
router.delete("/cancel/:requestId", friendController.cancelFriendRequest);

// Friends management
router.get("/", friendController.getFriends);
router.delete("/:friendId", friendController.removeFriend);

module.exports = router;