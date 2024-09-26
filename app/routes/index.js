// routes
const authRoute = require("../components/auth/auth.route");
const userRoute = require("../components/user/user.route");

module.exports = (app) => {
  // routes
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
};
