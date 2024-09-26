const { Http } = require("./server");
const env = require("./app/config/env");

/**
 * Start Express server.
 */
Http.listen(env.PORT, () => {
  console.log(
    `%s Http is running at http://localhost:%s in %s mode`,
    env.PRODUCT_NAME,
    env.PORT,
    env.NODE_ENV
  );
});

/**
 * Exports express.
 * @public
 */
module.exports = Http;
