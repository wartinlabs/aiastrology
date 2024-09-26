const router = require("express").Router();
const UserController = require("./user.controller");
const { auth } = require("../../middleware/authJWT");
const { uploadImageMiddleware } = require("../../utils/AwsService");

/**
 * @route GET api/user/me
 * @description get me
 * @returns JSON
 * @access public
 */
router.get("/me", auth, (req, res) => {
  UserController.getMe(req, res);
});

/**
 * @route GET api/user/get-profile/:id
 * @description Get Profile By Id
 * @returns JSON
 * @access public
 */
router.get("/get-profile/:id", auth, (req, res) => {
  UserController.getProfileById(req, res);
});

/**
 * @route POST api/user/update-user
 * @description update user
 * @returns JSON
 * @access public
 */
router.post("/update-user", auth, (req, res) => {
  UserController.updateUser(req, res);
});

/**
 * @route POST api/user/upload-image
 * @description Upload Image Profile
 * @returns JSON
 * @access public
 */
router.post(
  "/upload-image",
  auth,
  uploadImageMiddleware.single("image"),
  (req, res) => {
    UserController.uploadImageProfile(req, res);
  }
);

/**
 * @route POST api/user/search-users
 * @description search users
 * @returns JSON
 * @access public
 */
router.post("/search-users", auth, (req, res) => {
  UserController.searchUsers(req, res);
});

/**
 * @route POST api/user/send-notification
 * @description Send Notification
 * @returns JSON
 * @access public
 */
router.post("/send-notification", auth, (req, res) => {
  UserController.sendFCMNotification(req, res);
});

module.exports = router;
