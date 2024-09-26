/* eslint-disable no-console */

/**
 * Configuration for the database
 */

const mongoose = require("mongoose");

// Remove the warning with Promise
mongoose.Promise = global.Promise;

// mongoose.set('useFindAndModify', false);
const connect = (url) =>
  mongoose.connect(url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  });
module.exports = connect;
