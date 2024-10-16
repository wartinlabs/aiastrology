const {
  createError,
  createResponse,
  generateHash,
  comparePassword,
} = require("../../utils/helpers");
const {
  jwtGenerator,
  generateRefreshToken,
} = require("../../utils/jwtGenerator");
const { sendEmailForOtp } = require("../../utils/mailService");

const User = require("../../models/user");

class AuthController {
  /**
   * @description login
   */
  async login(req, res) {
    try {
      const { phone_no, callingCode, notification_token } = req.body;

      // check phone_no
      let userData = await User.findOne({
        callingCode,
        phone_no,
        phone_no_verified: false,
      }).select("phone_no");

      if (userData) {
        // update otp
        await User.findOneAndUpdate(
          { callingCode, phone_no },
          { $set: { notification_token, otp: 123456 } }
        ).select("phone_no");
      } else {
        // add new record
        await new User({
          phone_no,
          callingCode,
          otp: 123456,
          notification_token,
        }).save();
      }

      return createResponse(res, true, "Send Otp Success!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description OTP Verify
   */
  async otpVerify(req, res) {
    try {
      const { phone_no, otp } = req.body;

      const getPhoneNoPlayer = await User.findOne({
        phone_no,
      }).select("phone_no otp");

      if (!getPhoneNoPlayer)
        return createResponse(res, false, "Phone No is Wrong!");

      if (getPhoneNoPlayer) {
        if (getPhoneNoPlayer?.otp === otp) {
          let getUserData = await User.findOneAndUpdate(
            { phone_no },
            {
              $set: {
                phone_no_verified: true,
              },
            },
            { new: true }
          );

          const { token } = jwtGenerator(getUserData?._id);

          getUserData.token = token;

          return createResponse(res, true, "OTP is Verified!", {
            data: getUserData,
            token,
          });
        } else {
          return createResponse(res, false, "Incorrect Otp!");
        }
      } else {
        return createResponse(res, false, "Server Error!");
      }
    } catch (e) {
      return createError(res, e);
    }
  }

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
   * @description get all data
   */
  async getAllData(req, res) {
    try {
      const playerData = await User.find();

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Token Verify
   */
  async tokenVerify(req, res) {
    try {
      return createResponse(res, true, "Success");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description logout
   */
  async logout(req, res) {
    try {
      const userId = req.user.id;

      const result = await User.findById(userId).select("phone_no");

      if (result) {
        await User.findByIdAndUpdate(userId, {
          $set: { notificationToken: null, status: 0 },
        }).select("phone_no");
      } else {
        return createResponse(res, false, "Something Went Wrong!");
      }

      return createResponse(res, true, "Logout Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Verify Refresh Token
   */
  async verifyRefreshToken(req, res) {
    try {
      const userId = req.user.id;

      const { token } = jwtGenerator(userId);
      const { refreshToken } = generateRefreshToken(userId);
      const result = {
        token: token,
        refreshToken: refreshToken,
      };

      return createResponse(res, true, "Token Get Successfully!", result);
    } catch (e) {
      return createError(res, e);
    }
  }
}

const authController = new AuthController();
module.exports = authController;
