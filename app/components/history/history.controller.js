const { createError, createResponse } = require("../../utils/helpers");
const History = require("../../models/history");
const HistoryCall = require("../../models/history-call");
const User = require("../../models/user");
const PurchasePackage = require("../../models/purchase-package");

class HistoryController {
  /**
   * @description Add Money
   */
  async addMoney(req, res) {
    try {
      const userId = req.user.id;
      const { amount, status, purchasePackageId } = req.body;

      const getPurchasePackage = await PurchasePackage.findById(
        purchasePackageId
      ).select("time");

      if (!getPurchasePackage)
        return createResponse(res, false, "Purchase Package Id is wrong.");

      if (amount > 0) {
        const getUser = await User.findById(userId).select("timeBalance");

        if (!getUser) return createResponse(res, false, "User Not Found!");

        if (status === "Success") {
          await User.findByIdAndUpdate(userId, {
            $set: {
              timeBalance:
                parseInt(getUser.timeBalance) +
                parseInt(getPurchasePackage?.time),
            },
          }).select("name");

          await new History({
            userId,
            amount,
            status,
            purchasePackageId,
          }).save();

          return createResponse(res, true, "Add Money Successfully!");
        } else {
          await new History({
            userId,
            amount,
            status,
            purchasePackageId,
          }).save();

          return createResponse(res, false, "Payment is in Pending.");
        }
      } else {
        return createResponse(res, false, "Amount is 0.");
      }
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Get History
   */
  async getHistory(req, res) {
    try {
      const userId = req.user.id;

      const getHistory = await History.find({ userId });

      createResponse(res, true, "Success.", getHistory);
    } catch (e) {
      console.log("getHistory e...", e);
      return createError(res, e);
    }
  }

  /**
   * @description Get All History
   */
  async getAllHistory(req, res) {
    try {
      const getAllHistory = await History.find();

      createResponse(res, true, "Success.", getAllHistory);
    } catch (e) {
      console.log("getAllHistory e...", e);
      return createError(res, e);
    }
  }

  /**
   * @description Get Call History
   */
  async getCallHistory(req, res) {
    try {
      const userId = req.user.id;

      const getCallHistory = await HistoryCall.find({ userId });

      createResponse(res, true, "Success.", getCallHistory);
    } catch (e) {
      console.log("getCllHistory e...", e);
      return createError(res, e);
    }
  }
}

const historyController = new HistoryController();
module.exports = historyController;
