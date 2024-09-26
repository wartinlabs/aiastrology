const router = require("express").Router();
const AuthController = require("./auth.controller");
const { auth, verifyToken } = require("../../middleware/authJWT");

// Validation
const { userLoginValidation } = require("../../middleware/userValidation");

/**
 * @route POST api/auth/login
 * @description login
 * @returns JSON
 * @access public
 */
router.post("/login", userLoginValidation, (req, res) => {
  AuthController.login(req, res);
});

/**
 * @route POST api/auth/otp-verify
 * @description otp verify
 * @returns JSON
 * @access public
 */
router.post("/otp-verify", (req, res) => {
  AuthController.otpVerify(req, res);
});

/**
 * @route GET api/auth/me
 * @description get me
 * @returns JSON
 * @access public
 */
router.get("/me", auth, (req, res) => {
  AuthController.getMe(req, res);
});

/**
 * @route GET api/auth/get-all-data
 * @description get get-all-data
 * @returns JSON
 * @access public
 */
router.get("/get-all-data", (req, res) => {
  AuthController.getAllData(req, res);
});

/**
 * @route GET api/auth/token-verify
 * @description Token Verify
 * @returns JSON
 * @access public
 */
router.get("/token-verify", auth, (req, res) => {
  AuthController.tokenVerify(req, res);
});

/**
 * @route GET api/auth/logout
 * @description logout
 * @returns JSON
 * @access public
 */
router.get("/logout", auth, (req, res) => {
  AuthController.logout(req, res);
});

/**
 * @route GET api/auth/update-jwt-token
 * @description Update Token
 * @returns JSON
 * @access public
 */
router.get("/update-jwt-token", verifyToken, (req, res) => {
  AuthController.verifyRefreshToken(req, res);
});

module.exports = router;
