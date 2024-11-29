// let io;
const _ = require("lodash");

const User = require("../models/user");
const HistoryCall = require("../models/history-call");

const { getKeyByValue } = require("../utils/helpers");

const { checkTimeAndCutBalance } = require("./socket_handler");

let io;

module.exports = (server) => {
  console.log(`socket...`);
  const app_users = {};
  const liveUser = [];

  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      // origin: "http://localhost:5000/",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
    allowEIO3: true,
    pingTimeout: 10000,
    pingInterval: 5000,
  });

  io.on("connection", async (socket) => {
    console.log("socket connect...");

    socket.on("join_call", async (data) => {
      try {
        const { userId } = data;
        console.log("join_call data...", data);

        app_users[userId] = socket.id;

        const userData = await User.findOne({
          _id: userId,
        }).select("phone_no timeBalance");
        console.log("join_call userData...", userData);

        if (!userData) {
          console.log("User not found! Invalid Id!...");

          socket.emit("socket_error", {
            status: false,
            message: "User not found! Invalid Id!",
          });
          return;
        }

        // if (userData.timeBalance <= 0) {
        //   console.log("User Time Balance is not enough for the start call!...");

        //   socket.emit("socket_error", {
        //     status: false,
        //     message: "User Time Balance is not enough for the start call!",
        //   });
        //   return;
        // }

        const result = await new HistoryCall({ userId }).save();

        userData.status = 1;
        await userData.save();

        console.log("join_call result...", result);

        const resJson = {
          userData,
          historyCallId: result._id,
        };

        console.log("join_call resJson...", resJson);

        const socketIdSender = app_users[userId];

        console.log("join_call socket.id...", socket.id);

        const playerIdSender = getKeyByValue(app_users, socketIdSender);
        console.log("join_call playerIdSender...", playerIdSender);

        if (playerIdSender) {
          console.log("call playerIdSender...");
          return io.to(socketIdSender).emit("user_join_call", resJson);
        }

        return io.to(socket.id).emit("user_join_call", resJson);
      } catch (err) {
        console.log("Err join:", err);
        socket.emit("socket_error", {
          status: false,
          message: "Join Error!",
          err,
        });
        return;
      }
    });

    socket.on("end_call", async (data) => {
      try {
        const { historyCallId } = data;
        console.log("end_call data...", data);

        const getHistoryCall = await HistoryCall.findById(historyCallId).select(
          "start_time userId"
        );
        // console.log("getHistoryCall...", getHistoryCall);

        if (!getHistoryCall) {
          socket.emit("socket_error", {
            status: false,
            message: "Call History not found! Invalid Id!",
          });
          return;
        }

        const start_time = new Date(getHistoryCall.start_time);
        const end_time = new Date();
        const differenceInSeconds = (end_time - start_time) / 1000;

        // await checkTimeAndCutBalance(
        //   getHistoryCall?.userId,
        //   differenceInSeconds
        // );

        await HistoryCall.findByIdAndUpdate(historyCallId, {
          $set: {
            end_time,
            time: differenceInSeconds,
            status: "Closed",
          },
        }).select("historyCallId");

        const resJson = {
          message: "Call end successfully!",
        };

        io.to(socket.id).emit("user_end_call", resJson);
        return;
      } catch (err) {
        console.log("end-call err...", err);
        socket.emit("socket_error", {
          status: false,
          message: "End call Error!",
          err,
        });
        return;
      }
    });

    socket.on("disconnecting", async (data) => {
      try {
        console.log("disconnect=======================", data);
        const userId = getKeyByValue(app_users, socket.id);
        delete app_users[userId];

        if (userId) {
          const userData = await User.findOne({ _id: userId }).select(
            "name phone_no status"
          );

          if (userData) {
            userData.status = 0;
            await userData.save();

            const userHistoryCall = await HistoryCall.find({
              userId,
              status: "Starting",
            })
              .sort({ _id: -1 })
              .limit(1);

            if (userHistoryCall.length > 0) {
              // starting call found.
              console.log("starting call found...");

              const start_time = new Date(userHistoryCall[0].start_time);
              const end_time = new Date();
              const differenceInSeconds = (end_time - start_time) / 1000;

              await checkTimeAndCutBalance(
                userHistoryCall[0]?.userId,
                differenceInSeconds
              );

              await HistoryCall.findByIdAndUpdate(userHistoryCall[0]._id, {
                $set: {
                  end_time,
                  time: differenceInSeconds,
                  status: "AutoClosed",
                },
              }).select("historyCallId");
            } else {
              // starting call not found
              console.log("starting call not found...");
            }

            socket.broadcast.emit("user_left", userId);
          }
        }
      } catch (err) {
        console.log("Err disconnecting...", err);
      }
    });
  });
};
