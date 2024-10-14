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
 * @route POST api/user/update_user
 * @description Update User
 * @returns JSON
 * @access public
 */
router.post("/update_user", auth, (req, res) => {
  UserController.UpdateUser(req, res);
});

/**
 * @route DELETE api/user/delete_user
 * @description Delete User
 * @returns JSON
 * @access public
 */
router.delete("/delete_user", auth, (req, res) => {
  UserController.DeleteUser(req, res);
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
