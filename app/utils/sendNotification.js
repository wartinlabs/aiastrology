const User = require("../models/user");
var admin = require("firebase-admin");
var fcm = require("fcm-notification");
// var serviceAccount = require("../../app/config/push-notification.json");
// const certPath = admin.credential.cert(serviceAccount);
// var FCM = new fcm(certPath);

const sendNotification = async (userId, data) => {
  const userData = await User.findById(userId).select("notificationToken");
  console.log("userData...", userData);

  if (
    userData !== null &&
    userData.notificationToken !== null &&
    userData.notificationToken !== "null" &&
    userData.notificationToken !== ""
  ) {
    console.log("call...");
    let messageData = {
      // notification: {
      //   title: "Hey-G",
      //   body: data,
      // },
      data,
      token: userData.notificationToken,
    };

    // FCM.send(messageData, (err, response) => {
    //   if (err) {
    //     console.log("Something has gone wrong!", err);
    //     // return { status: false, message: err };
    //   } else {
    //     console.log("Push notification sent...", response);
    //     // return { status: true };
    //   }
    // });
  } else {
    console.log("sendNotificationlog notificationToken is null!");
    // return { status: false, message: "Notification token is null!" };
  }
};

const sendNotificationMultipleUsers = async (title, body, imageName, users) => {
  for (let i = 0; i < users.length; i++) {
    const getPlayer = await User.findOne({
      playerId: users[i].playerId,
    }).select("notificationToken");

    if (getPlayer?.notificationToken) {
      let message = {
        notification: {
          title: title,
          body: body,
          image: imageName,
        },
        token: getPlayer?.notificationToken,
      };

      // FCM.send(message, (err, response) => {
      //   if (err) {
      //     console.log("Something has gone wrong!", err);
      //   } else {
      //     console.log("Push notification sent.", response);
      //   }
      // });
    }
  }
};

module.exports = { sendNotification, sendNotificationMultipleUsers };
