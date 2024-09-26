const jwt = require("jsonwebtoken");
const env = require("../config/env");

const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id,
  };

  const token = jwt.sign(payload, process.env.SECRET_JWT, {
    expiresIn: "1d",
  });

  return { token };
};

const generateRefreshToken = (user_id) => {
  const payload = {
    user: user_id,
  };

  const refreshToken = jwt.sign(payload, env.SECRET_JWT, {
    expiresIn: "7d",
  });
  return { refreshToken };
};

module.exports = { jwtGenerator, generateRefreshToken };
