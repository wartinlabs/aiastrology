const { createError, createResponse } = require("../../utils/helpers");
const { AwsService } = require("../../utils/AwsService");
const awsService = new AwsService();
const User = require("../../models/user");

class UserController {
  /**
   * @description get Me
   */
  async getMe(req, res) {
    try {
      const userId = req.user.id;

      const playerData = await User.findById(userId);

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description upload image Profile
   */
  async uploadImageProfile(req, res) {
    try {
      const userId = req.user.id;

      const userData = await User.findById(userId).select("image");

      if (userData?.image) awsService.remove(userData.image);

      const uploadRes = await awsService.save(req.file, "image");

      if (uploadRes.status) {
        const url = uploadRes?.message?.Location;

        await User.findByIdAndUpdate(userId, { $set: { image: url } }).select(
          "phone_no"
        );

        return createResponse(
          res,
          true,
          "Profile Image Upload Successfully!",
          url
        );
      }

      return createError(res, uploadRes.message);
    } catch (e) {
      return createError(res, e);
    }
  }
}

const userController = new UserController();
module.exports = userController;
