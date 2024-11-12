const { createError, createResponse } = require("../../utils/helpers");
const PurchasePackage = require("../../models/purchase-package");

class PurchasePackageController {
  /**
   * @description Add Purchase Package
   */
  async addPurchasePackage(req, res) {
    try {
      const { time, price } = req.body;

      await new PurchasePackage({ time, price }).save();

      return createResponse(res, true, "Add Package Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Update Purchase Package
   */
  async updatePurchasePackage(req, res) {
    try {
      const { id } = req.params;
      const { time, price } = req.body;

      await PurchasePackage.findByIdAndUpdate(id, {
        $set: { time, price },
      });

      return createResponse(res, true, "Update Package Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Delete Purchase Package
   */
  async deletePurchasePackage(req, res) {
    try {
      const { id } = req.params;

      await PurchasePackage.findByIdAndDelete(id);

      return createResponse(res, true, "Delete Package Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Get Purchase Package
   */
  async getPurchasePackage(req, res) {
    try {
      const getPurchasePackage = await PurchasePackage.find();

      return createResponse(
        res,
        true,
        "Get Package Successfully!",
        getPurchasePackage
      );
    } catch (e) {
      return createError(res, e);
    }
  }
}

const purchasePackageController = new PurchasePackageController();
module.exports = purchasePackageController;
