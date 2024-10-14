// routes
const authRoute = require("../components/auth/auth.route");
const userRoute = require("../components/user/user.route");
const relativeUserRoute = require("../components/relatives_user/relatives_user.route");

module.exports = (app) => {
  // routes
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/relatives_user", relativeUserRoute);
};
