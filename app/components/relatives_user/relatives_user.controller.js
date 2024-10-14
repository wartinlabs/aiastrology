const { createError, createResponse } = require("../../utils/helpers");
const RelativesUser = require("../../models/relatives_user");
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

      const result = await new RelativesUser({
        userId,
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        country,
        rashi,
      }).save();

      return createResponse(res, true, "Add Relative Successfully!", result);
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

      const result = await RelativesUser.findByIdAndUpdate(
        id,
        {
          name,
          gender,
          date_of_birth,
          time_of_birth,
          place_of_birth,
          country,
          rashi,
        },
        { new: true }
      ).select("name");

      return createResponse(res, true, "Update Relative Successfully!", result);
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
