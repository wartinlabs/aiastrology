const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/env");

const { createError, createResponse } = require("../utils/helpers");

module.exports.auth = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return createResponse(res, false, "Not Authorized!", null, 401);
    }
    const payload = jwt.verify(jwtToken, config.SECRET_JWT);
    const adminData = await User.findById(payload.user);

    if (!adminData)
      return createResponse(res, false, "Not Authorized!", null, 401);

    req.user = {
      id: adminData._id,
    };
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      return createResponse(res, false, "jwt expired!", null, 401);
    }

    return createError(res, err);
  }
};

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header("refreshToken");

    if (!token) {
      return createResponse(
        res,
        false,
        "Not Authorized! Invalid token",
        null,
        401
      );
    }

    const payload = jwt.verify(token, config.SECRET_JWT);

    const userData = await User.findById(payload.user);

    if (!userData)
      return createResponse(res, false, "Not Authorized!", null, 401);

    req.user = {
      id: userData._id,
    };
    next();
  } catch (err) {
    return { status: false, message: "Not Authorized! Invalid token" };
  }
};
