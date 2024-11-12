const router = require("express").Router();
const UserController = require("./history.controller");
const { auth } = require("../../middleware/authJWT");

/**
 * @route POST api/history/add-money
 * @description Add Money in Wallet
 * @returns JSON
 * @access public
 */
router.post("/add-money", auth, (req, res) => {
  UserController.addMoney(req, res);
});

/**
 * @route GET api/history/get-history
 * @description Get History
 * @returns JSON
 * @access public
 */
router.get("/get-history", auth, (req, res) => {
  UserController.getHistory(req, res);
});

/**
 * @route GET api/history/get-all-history
 * @description Get All History
 * @returns JSON
 * @access public
 */
router.get("/get-all-history", auth, (req, res) => {
  UserController.getAllHistory(req, res);
});

/**
 * @route GET api/history/get-call-history
 * @description Get All History
 * @returns JSON
 * @access public
 */
router.get("/get-call-history", auth, (req, res) => {
  UserController.getCallHistory(req, res);
});

module.exports = router;
