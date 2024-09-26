require("dotenv/config");

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PRODUCT_NAME: process.env.PRODUCT_NAME,
  PORT: process.env.PORT,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  SECRET_JWT: process.env.SECRET_JWT,
  EMAIL_OTP: process.env.EMAIL_OTP,
  EMAIL_PASS_OTP: process.env.EMAIL_PASS_OTP,
  OPEN_AI_KEY: process.env.OPEN_AI_KEY,
  NOVITA_API_KEY: process.env.NOVITA_API_KEY,
  AWS_S3_BUCKET_ACCESS_KEY_ID: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
  AWS_S3_BUCKET_SECRET_ACCESS_KEY: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  ASTRO_USER_NAME: process.env.ASTRO_USER_NAME,
  ASTRO_PASSWORD: process.env.ASTRO_PASSWORD,
};
