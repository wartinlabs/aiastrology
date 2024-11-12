const router = require("express").Router();
const PurchasePackageController = require("./purchase_package.controller");

/**
 * @route POST api/purchase_package/add-purchase_package
 * @description Add Purchase Package
 * @returns JSON
 * @access public
 */
router.post("/add-purchase_package", (req, res) => {
  PurchasePackageController.addPurchasePackage(req, res);
});

/**
 * @route POST api/purchase_package/update-purchase_package/:id
 * @description Update Purchase Package
 * @returns JSON
 * @access public
 */
router.post("/update-purchase_package/:id", (req, res) => {
  PurchasePackageController.updatePurchasePackage(req, res);
});

/**
 * @route DELETE api/purchase_package/delete-purchase_package/:id
 * @description Delete Purchase Package
 * @returns JSON
 * @access public
 */
router.delete("/delete-purchase_package/:id", (req, res) => {
  PurchasePackageController.deletePurchasePackage(req, res);
});

/**
 * @route GET api/purchase_package/get-purchase_package
 * @description Get Purchase Package
 * @returns JSON
 * @access public
 */
router.get("/get-purchase_package", (req, res) => {
  PurchasePackageController.getPurchasePackage(req, res);
});

module.exports = router;
