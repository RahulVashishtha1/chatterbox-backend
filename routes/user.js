const router = require("express").Router();

const authController = require("./../controllers/authController");

const userController = require("./../controllers/userController");

router.use(authController.protect)

router.get("/me",  userController.getMe);
router.patch("/me",  userController.updateMe);
router.patch("/avatar",  userController.updateAvatar);
router.patch(
  "/password",
  userController.updatePassword
);

router.get("/users",  userController.getUsers);
router.post(
  "/start-conversation",
  userController.startConversation
);
router.get(
  "/conversations",
  userController.getConversations
);

router.get("/profile", userController.getCurrentUserProfile);
router.patch("/update-name", userController.updateUserName);

module.exports = router;
