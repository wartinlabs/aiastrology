const { createError, createResponse } = require("../../utils/helpers");
const { AwsService } = require("../../utils/AwsService");
const awsService = new AwsService();
const User = require("../../models/user");
const env = require("../../config/env");
const axios = require("axios");

const getRashi = async (day, month, year, hour, min, lat, lon, tzone) => {
  const username = env.ASTRO_USER_NAME;
  const password = env.ASTRO_PASSWORD;

  // Encode the credentials in base64
  const auth = btoa(`${username}:${password}`);

  const data = {
    day,
    month,
    year,
    hour,
    min,
    lat,
    lon,
    tzone,
  };

  let astro_config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://json.astrologyapi.com/v1/astro_details",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    data: JSON.stringify(data),
  };
  const astroData = await axios.request(astro_config);

  let planets_config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://json.astrologyapi.com/v1/planets",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    data: JSON.stringify(data),
  };
  const planetsData = await axios.request(planets_config);

  let vdasha_config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://json.astrologyapi.com/v1/current_vdasha",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    data: JSON.stringify(data),
  };
  const vdashaData = await axios.request(vdasha_config);

  return {
    astro: astroData.data,
    planets: planetsData.data,
    vdasha: vdashaData.data,
  };
};
class UserController {
  /**
   * @description Get Me
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
   * @description Update User
   */
  async UpdateUser(req, res) {
    try {
      const userId = req.user.id;
      const {
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        country,
        image,
        day,
        month,
        year,
        hour,
        min,
        lat,
        lon,
        tzone,
      } = req.body;

      const rashi = await getRashi(
        day,
        month,
        year,
        hour,
        min,
        lat,
        lon,
        tzone
      );

      const result = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            gender,
            date_of_birth,
            time_of_birth,
            place_of_birth,
            country,
            image,
            rashi,
          },
        },
        { new: true }
      ).select(
        "name image gender date_of_birth time_of_birth place_of_birth country rashi"
      );

      const data = {
        image: result.image,
        date_of_birth: result.date_of_birth,
        gender: result.gender,
        name: result.name,
        place_of_birth: result.place_of_birth,
        rashi: result.rashi,
        time_of_birth: result.time_of_birth,
        country: result.country,
        lat,
        lon,
      };

      return createResponse(res, true, "Update Successfully!", data);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Delete User
   */
  async DeleteUser(req, res) {
    try {
      const userId = req.user.id;

      await User.findByIdAndDelete(userId).select("name");

      return createResponse(res, true, "Delete Successfully!");
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
