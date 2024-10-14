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

module.exports = router;
