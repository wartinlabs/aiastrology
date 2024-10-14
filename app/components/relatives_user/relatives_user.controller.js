const { createError, createResponse } = require("../../utils/helpers");

const RelativesUser = require("../../models/relatives_user");

class AuthController {
  /**
   * @description Add Relatives User
   */
  async AddRelativesUser(req, res) {
    try {
      const userId = req.user.id;
      const {
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        country,
      } = req.body;

      await new RelativesUser({
        userId,
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        country,
      }).save();

      return createResponse(res, true, "Add Relative Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Update Relatives User
   */
  async UpdateRelativesUser(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        country,
      } = req.body;

      await RelativesUser.findByIdAndUpdate(id, {
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        country,
      }).select("name");

      return createResponse(res, true, "Update Relative Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Delete Relatives User
   */
  async DeleteRelativesUser(req, res) {
    try {
      const { id } = req.params;

      await RelativesUser.findByIdAndDelete(id);

      return createResponse(res, true, "Delete Relative Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Get Relatives User Id
   */
  async GetRelativesUser(req, res) {
    try {
      const { id } = req.params;

      const data = await RelativesUser.findById(id);

      return createResponse(res, true, "Get Relative Successfully!", data);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Get Relatives User By User Id
   */
  async GetRelativesByUser(req, res) {
    try {
      const userId = req.user.id;

      const data = await RelativesUser.find({ userId });

      return createResponse(
        res,
        true,
        "Get Relative users Successfully!",
        data
      );
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Get All Relatives User
   */
  async GetAllRelativesUsers(req, res) {
    try {
      const data = await RelativesUser.find();

      return createResponse(
        res,
        true,
        "Get All Relative users Successfully!",
        data
      );
    } catch (e) {
      return createError(res, e);
    }
  }
}

const authController = new AuthController();
module.exports = authController;
