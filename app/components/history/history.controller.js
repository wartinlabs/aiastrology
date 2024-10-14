const { createError, createResponse } = require("../../utils/helpers");
const History = require("../../models/history");
const User = require("../../models/user");

class HistoryController {
  /**
   * @description Add Money
   */
  async addMoney(req, res) {
    try {
      const userId = req.user.id;
      const { amount, status } = req.body;

      if (amount > 0) {
        const getUser = User.findById(userId).select("balance");

        if (!getUser) return createResponse(res, false, "User Not Found!");

        if (status === "Success") {
          await User.findByIdAndUpdate(userId, {
            $set: { balance: parseInt(getUser.balance) + parseInt(amount) },
          }).select(name);

          await new History({ userId, amount, status }).save();

          return createResponse(res, true, "Add Money Successfully!");
        } else {
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
   * @description Update History Status
   */
  async updateHistoryStatus(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.body;
      const { id } = req.params;

      const getUser = User.findById(userId).select("balance");

      if (!getUser) return createResponse(res, false, "User Not Found!");

      const getHistory = await History.findById(id).select("status");

      if (!getHistory) return createResponse(res, false, "History Not Found!");

      if (getHistory?.status) {
        if (status === getHistory?.status) {
          if (status === "Success") {
            await User.findByIdAndUpdate(userId, {
              $set: { balance: parseInt(getUser.balance) + parseInt(amount) },
            }).select(name);

            await new History({ userId, amount, status }).save();

            return createResponse(res, true, "Add Money Successfully!");
          }
        } else {
          return createResponse(
            res,
            false,
            `History Status is already ${status}.`
          );
        }
      } else {
        return createResponse(res, false, `History Status is already Success.`);
      }
    } catch (e) {
      return createError(res, e);
    }
  }
}

const historyController = new HistoryController();
module.exports = historyController;
