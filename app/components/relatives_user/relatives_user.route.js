const router = require("express").Router();
const RelativesUserController = require("./relatives_user.controller");
const { auth } = require("../../middleware/authJWT");

/**
 * @route POST api/relatives_user/add_relatives_user
 * @description Add Relatives User
 * @returns JSON
 * @access public
 */
router.post("/add_relatives_user", auth, (req, res) => {
  RelativesUserController.AddRelativesUser(req, res);
});

/**
 * @route POST api/relatives_user/update_relatives_user/:id
 * @description Update Relatives User
 * @returns JSON
 * @access public
 */
router.post("/update_relatives_user/:id", auth, (req, res) => {
  RelativesUserController.UpdateRelativesUser(req, res);
});

/**
 * @route DELETE api/relatives_user/delete_relatives_user/:id
 * @description Delete Relatives User
 * @returns JSON
 * @access public
 */
router.delete("/delete_relatives_user/:id", auth, (req, res) => {
  RelativesUserController.DeleteRelativesUser(req, res);
});

/**
 * @route GET api/relatives_user/get_relatives_user/:id
 * @description Get Relatives User Id
 * @returns JSON
 * @access public
 */
router.get("/get_relatives_user/:id", auth, (req, res) => {
  RelativesUserController.GetRelativesUser(req, res);
});

/**
 * @route GET api/relatives_user/get_relatives_by_user
 * @description Get Relatives User By User Id
 * @returns JSON
 * @access public
 */
router.get("/get_relatives_by_user", auth, (req, res) => {
  RelativesUserController.GetRelativesByUser(req, res);
});

/**
 * @route GET api/relatives_user/get_all_relatives_user
 * @description Get All Relatives User
 * @returns JSON
 * @access public
 */
router.get("/get_all_relatives_user", auth, (req, res) => {
  RelativesUserController.GetAllRelativesUsers(req, res);
});

/**
 * @route POST api/relatives_user/get_horoscope_data
 * @description Get Horoscope Data
 * @returns JSON
 * @access public
 */
router.post("/get_horoscope_data", auth, (req, res) => {
  RelativesUserController.GetHoroscopeData(req, res);
});

module.exports = router;
