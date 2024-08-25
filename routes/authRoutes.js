const authController = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const authRouter = require("express").Router();

authRouter.post("/admin-login", authController.admin_login);
authRouter.post("/seller-login", authController.seller_login);
authRouter.get("/get-user", authMiddleware, authController.getUer);
authRouter.post("/seller-register", authController.seller_register);
authRouter.post(
  "/profile-image-upload",
  authMiddleware,
  authController.profile_image_upload
);
authRouter.post(
  "/profile-info-add",
  authMiddleware,
  authController.profile_info_add
);

module.exports = authRouter;
