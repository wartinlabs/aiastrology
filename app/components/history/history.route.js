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
 * @route POST api/history/update-history-status/:id
 * @description Update History Status
 * @returns JSON
 * @access public
 */
router.post("/update-history-status/:id", auth, (req, res) => {
  UserController.updateHistoryStatus(req, res);
});

module.exports = router;
