const { createError, createResponse } = require("../../utils/helpers");
const { sendNotification } = require("../../utils/sendNotification");
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
   * @description Get Profile By Id
   */
  async getProfileById(req, res) {
    try {
      const { id } = req.params;

      const playerData = await User.findById(id).select(
        "f_name l_name name image bio createdAt"
      );

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description update user
   */
  async updateUser(req, res) {
    try {
      const userId = req.user.id;
      const { f_name, l_name, bio } = req.body;

      const playerData = await User.findByIdAndUpdate(
        userId,
        {
          $set: { f_name, l_name, bio },
        },
        { new: true }
      ).select("phone_no f_name l_name bio");

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

  /**
   * @description Search Users
   */
  async searchUsers(req, res) {
    try {
      const { name } = req.body;

      const playerData = await User.aggregate(
        [
          {
            $match: {
              $or: [{ name: { $regex: new RegExp(name, "i") } }],
            },
          },
          {
            $project: {
              _id: 1,
              phone_no: 1,
              name: 1,
              status: 1,
            },
          },
        ],
        { allowDiskUse: true }
      );

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Send Notification
   */
  async sendFCMNotification(req, res) {
    try {
      const { userId, data } = req.body;
      console.log("req.body...", req.body);

      await sendNotification(userId, data);
      // const result = await sendNotification(userId, data);
      // console.log("result...", result);

      // if (result.status) {
      return createResponse(res, true, "Send Notification Successfully!");
      // } else {
      //   return createResponse(res, false, result.message);
      // }
    } catch (e) {
      return createError(res, e);
    }
  }
}

const userController = new UserController();
module.exports = userController;
