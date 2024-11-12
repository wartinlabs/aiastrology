const User = require("../models/user");

const checkTimeAndCutBalance = async (userId, totalTime) => {
  console.log("checkTimeAndCutBalancecall...");

  const getUser = await User.findById(userId).select("timeBalance");

  if (getUser.timeBalance >= totalTime) {
    // it's okay
    await User.findByIdAndUpdate(userId, {
      $set: {
        timeBalance: parseInt(getUser.timeBalance) - parseInt(totalTime),
      },
    }).select("timeBalance");
  } else {
    // timeBalance is low.
    console.log("timeBalance is low.");
  }
};

module.exports = {
  checkTimeAndCutBalance,
};
