// let io;
const _ = require("lodash");

const User = require("../models/user");
const Message = require("../models/message");
// const RoomCall = require("../models/room_call");

const { getKeyByValue } = require("../utils/helpers");
const mongoose = require("mongoose");

const { OpenAI } = require("openai");
const { OPEN_AI_KEY } = require("../config/env");
const openai = new OpenAI({
  apiKey: OPEN_AI_KEY,
});

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

    socket.on("join", async (data) => {
      try {
        const { userId } = data;

        app_users[userId] = socket.id;

        const userData = await User.findOne({
          _id: userId,
        }).select("email");

        if (!userData) {
          socket.emit("socket_error", {
            status: false,
            message: "Player not found! Invalid Id!",
          });
          return;
        }

        userData.status = 1;
        await userData.save();

        io.to(socket.id).emit("user_join", userData);
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

    socket.on("get_message_users", async (data) => {
      try {
        const { userId } = data;

        const socketIdSender = app_users[userId];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        // const results = await Message.find({ users: userId })
        //   .select("users isGroup")
        //   .populate({
        //     path: "users",
        //     select: "name email emailVerified status",
        //   })
        //   .exec();

        const results = await Message.aggregate([
          { $match: { users: new mongoose.Types.ObjectId(userId) } },
          {
            $project: {
              users: 1,
              isGroup: 1,
              message: { $slice: ["$message", -1] }, // get the last element in the message array
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "users",
              foreignField: "_id",
              as: "users",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    email: 1,
                    emailVerified: 1,
                    status: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$users" },
          {
            $group: {
              _id: "$_id",
              users: { $push: "$users" },
              isGroup: { $first: "$isGroup" },
              message: { $first: "$message" },
            },
          },
          {
            $project: {
              _id: 1,
              id: { $toString: "$_id" },
              users: 1,
              isGroup: 1,
              message: 1,
            },
          },
        ]).exec();

        const resultData = results.map((doc) => ({
          _id: doc._id,
          users: doc.users,
          isGroup: doc.isGroup,
          id: doc.id,
          message: doc.message[0], // since we only have one message element in the array
        }));
        console.log("resultData...", resultData);

        if (playerIdSender) {
          return io.to(socketIdSender).emit("get_message_users", resultData);
        }
      } catch (err) {
        console.log("Err get_message_userslog:", err);
        socket.emit("socket_error", {
          status: false,
          message: "Get Message Users Error!",
          err,
        });
        return;
      }
    });

    const getMessageUsers = async (data) => {
      try {
        const { userId } = data;

        const socketIdSender = app_users[userId];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        const results = await Message.aggregate([
          { $match: { users: new mongoose.Types.ObjectId(userId) } },
          {
            $project: {
              users: 1,
              isGroup: 1,
              message: { $slice: ["$message", -1] }, // get the last element in the message array
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "users",
              foreignField: "_id",
              as: "users",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    email: 1,
                    emailVerified: 1,
                    status: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$users" },
          {
            $group: {
              _id: "$_id",
              users: { $push: "$users" },
              isGroup: { $first: "$isGroup" },
              message: { $first: "$message" },
            },
          },
          {
            $project: {
              _id: 1,
              id: { $toString: "$_id" },
              users: 1,
              isGroup: 1,
              message: 1,
            },
          },
        ]).exec();

        const resultData = results.map((doc) => ({
          _id: doc._id,
          users: doc.users,
          isGroup: doc.isGroup,
          id: doc.id,
          message: doc.message[0], // since we only have one message element in the array
        }));

        if (playerIdSender) {
          return io.to(socketIdSender).emit("get_message_users", resultData);
        }
      } catch (err) {
        console.log("Err get_message_userslog:", err);
        socket.emit("socket_error", {
          status: false,
          message: "Get Message Users Error!",
          err,
        });
        return;
      }
    };

    socket.on("get_message", async (data) => {
      try {
        const { messageId, userId } = data;

        const socketIdSender = app_users[userId];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        const results = await Message.findById(messageId);
        console.log("result...", results);

        if (playerIdSender) {
          return io.to(socketIdSender).emit("get_message", results);
        }
      } catch (err) {
        console.log("Err get_message:", err);
        socket.emit("socket_error", {
          status: false,
          message: "Get Message Error!",
          err,
        });
        return;
      }
    });

    let chatValue = 0;
    const botChatFun = async (
      senderPlayerId,
      receiverPlayerId,
      message,
      status
    ) => {
      if (status) return;

      chatValue += 1;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });

      const socketIdSender = app_users[senderPlayerId];
      const socketIdReceiver = app_users[receiverPlayerId];

      const objectIdArray = [senderPlayerId, receiverPlayerId];
      const pipeline = [
        {
          $match: {
            users: {
              $all: objectIdArray.map((id) => new mongoose.Types.ObjectId(id)),
            },
            isGroup: false,
          },
        },
      ];
      const results = await Message.aggregate(pipeline);
      console.log("result...", results);

      if (results.length > 0) {
        // update chat in model
        await Message.findByIdAndUpdate(results[0]._id, {
          $push: {
            message: {
              senderId: senderPlayerId,
              receiverId: receiverPlayerId,
              message,
              dateTime: new Date(),
            },
          },
        });
      } else {
        // create new array of object for message
        await new Message({
          users: [senderPlayerId, receiverPlayerId],
          message: {
            senderId: senderPlayerId,
            receiverId: [receiverPlayerId],
            message,
            dateTime: new Date(),
          },
        }).save();
      }

      const playerIdSender = getKeyByValue(app_users, socketIdSender);
      const playerIdReceiver = getKeyByValue(app_users, socketIdReceiver);

      const userMessages = await Message.aggregate(pipeline);

      if (playerIdSender) {
        io.to(socketIdSender).emit("receive_message", userMessages);
      }
      if (playerIdReceiver) {
        io.to(socketIdReceiver).emit("receive_message", userMessages);
      }

      if (chatValue % 2 === 0) {
        await botChatFun(
          senderPlayerId,
          receiverPlayerId,
          response.choices[0].message.content,
          false
        );
      } else {
        await botChatFun(
          receiverPlayerId,
          senderPlayerId,
          response.choices[0].message.content,
          false
        );
      }
    };

    socket.on("bot_chat", async (data) => {
      try {
        const { senderPlayerId, receiverPlayerId, message } = data;
        await botChatFun(senderPlayerId, receiverPlayerId, message, false);
      } catch (e) {
        console.log("Err bot_chat :", e);
      }
    });

    socket.on("bot_chat_stop", async (data) => {
      try {
        await botChatFun("", "", "", true);
      } catch (e) {
        console.log("Err bot_chat_stop :", e);
      }
    });

    const oneToOneChat = async (
      senderUserId,
      receiverUserId,
      message,
      type
    ) => {
      console.log(
        "oneToOneChat...",
        senderUserId,
        receiverUserId,
        message,
        type
      );

      const socketIdSender = app_users[senderUserId];
      const socketIdReceiver = app_users[receiverUserId];

      const objectIdArray = [senderUserId, receiverUserId];
      const pipeline = [
        {
          $match: {
            users: {
              $all: objectIdArray.map((id) => new mongoose.Types.ObjectId(id)),
            },
            isGroup: false,
          },
        },
      ];
      const results = await Message.aggregate(pipeline);

      if (results.length > 0) {
        // update chat in model
        await Message.findByIdAndUpdate(results[0]._id, {
          $push: {
            message: {
              senderId: senderUserId,
              receiverId: receiverUserId,
              message,
              dateTime: new Date(),
              type,
            },
          },
        });
      } else {
        // create new array of object for message
        await new Message({
          users: [senderUserId, receiverUserId],
          message: {
            senderId: senderUserId,
            receiverId: [receiverUserId],
            message,
            dateTime: new Date(),
            type,
          },
        }).save();
      }

      const playerIdSender = getKeyByValue(app_users, socketIdSender);
      const playerIdReceiver = getKeyByValue(app_users, socketIdReceiver);

      const userMessages = await Message.aggregate(pipeline);

      if (playerIdSender) {
        io.to(socketIdSender).emit("receive_message", userMessages);
      }
      if (playerIdReceiver) {
        io.to(socketIdReceiver).emit("receive_message", userMessages);
        await getMessageUsers({ userId: receiverUserId });
      }
    };

    socket.on("send_message", async (data) => {
      try {
        const { isGroup, senderUserId, receiverUserId, message, type } = data;

        const userData = await User.findOne({
          _id: senderUserId,
        }).select("email");

        const receiverUserData = await User.findOne({
          _id: receiverUserId,
        }).select("email");

        if (!userData) {
          socket.emit("socket_error", {
            status: false,
            message: "Player not found! Invalid Id",
          });
          return;
        }

        if (!receiverUserData) {
          socket.emit("socket_error", {
            status: false,
            message: "Receiver Player not found! Invalid Id",
          });
          return;
        }

        if (isGroup) {
          // group chat
          await groupChat(senderUserId, receiverUserId, message, type);
        } else {
          // one to one chat data
          await oneToOneChat(senderUserId, receiverUserId, message, type);
        }
      } catch (err) {
        console.log("Err send_message :", err);
      }
    });

    socket.on("online_users", async (data) => {
      try {
        const { userId } = data;

        console.log("online_users...");

        const socketIdSender = app_users[userId];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        const userData = User.find({ status: 1 }).select("email");

        const result = {
          users: userData,
        };

        if (playerIdSender) {
          return io.to(socketIdSender).emit("online_users", result);
        }
      } catch (err) {
        console.log("Err online_users :", err);
      }
    });

    socket.on("create_call_room", async (data) => {
      try {
        const { userId } = data;

        const createNewRoom = await RoomCall({
          users: { userId, status: "IN" },
          room_status: "START",
        }).save();

        const socketIdSender = app_users[userId];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        const result = {
          room: createNewRoom,
        };

        if (playerIdSender) {
          return io.to(socketIdSender).emit("create_call_room", result);
        }
      } catch (err) {
        console.log("err create_call_room", err);
      }
    });

    socket.on("join_call_room", async (data) => {
      try {
        const { roomId, userId } = data;

        await RoomCall.findByIdAndUpdate(roomId, {
          $push: { users: { userId, status: "IN" } },
          $set: { room_status: "RUNNING" },
        });

        const getRoomData = await RoomCall.findById(roomId).select("users");

        for (let i = 0; i < getRoomData.users.length; i++) {
          if (getRoomData.users[i].userId === userId) {
            const socketIdSender = app_users[userId];

            const playerIdSender = getKeyByValue(app_users, socketIdSender);

            const result = {
              room: getRoomData,
              message: `You are Joined!`,
            };

            if (playerIdSender) {
              io.to(socketIdSender).emit("join_call_room", result);
            }
          } else {
            const getUserData = await User.findById(
              getRoomData.users[i].userId
            ).select("name");

            const socketIdSender = app_users[getRoomData.users[i].userId];

            const playerIdSender = getKeyByValue(app_users, socketIdSender);

            const result = {
              room: createNewRoom,
              message: `${getUserData?.name} is Joined!`,
            };

            if (playerIdSender) {
              io.to(socketIdSender).emit("join_call_room", result);
            }
          }
        }
      } catch (err) {
        console.log("err join_call_room...", err);
      }
    });

    socket.on("remove_call_room", async (data) => {
      try {
        const { roomId, userId } = data;

        await RoomCall.findOneAndDelete({
          _id: roomId,
          users: { $in: { userId } },
        });

        const getRoomData = await RoomCall.findById(roomId).select("users");

        for (let i = 0; i < getRoomData?.users?.length; i++) {
          if (getRoomData?.users[i]?.userId === userId) {
            const socketIdSender = app_users[userId];

            const playerIdSender = getKeyByValue(app_users, socketIdSender);

            const result = {
              message: "You are remove from the call!",
            };

            if (playerIdSender) {
              return io.to(socketIdSender).emit("remove_call_room", result);
            }
          } else {
            const getUserData = await User.findById(
              getRoomData?.users[i]?.userId
            ).select("name");

            const socketIdSender = app_users[getRoomData.users[i].userId];

            const playerIdSender = getKeyByValue(app_users, socketIdSender);

            const result = {
              room: createNewRoom,
              message: `${getUserData?.name} was removed from the call!`,
            };

            if (playerIdSender) {
              io.to(socketIdSender).emit("join_call_room", result);
            }
          }
        }
      } catch (err) {
        console.log("err remove_call_room...", err);
      }
    });

    socket.on("get_all_room_users", async (data) => {
      try {
        const { roomId, userId } = data;

        const getRoomData = await RoomCall.findById(roomId);

        const socketIdSender = app_users[userId];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        const result = {
          room: getRoomData,
        };

        if (playerIdSender) {
          return io.to(socketIdSender).emit("get_all_room_users", result);
        }
      } catch (err) {
        console.log("err get_all_room_users...", err);
      }
    });

    // liveUser = [
    //   {
    //     userId: "123123",
    //     joinUser: ["456456", "789789"],
    //     chat: [
    //       { userId: "123123", message: "hello" },
    //       { userId: "456456", message: "how are you?" },
    //       { userId: "789789", message: "fine!" },
    //     ],
    //   },
    //   {
    //     userId: "135135",
    //     joinUser: ["246246", "468468"],
    //     chat: [
    //       { userId: "246246", message: "hello" },
    //       { userId: "135135", message: "how are you?" },
    //       { userId: "468468", message: "fine!" },
    //     ],
    //   },
    // ];

    const sendAllLiveUsersResponse = async (
      users,
      emit,
      message,
      usersData
    ) => {
      for (let i = 0; i < users.length; i++) {
        const socketIdSender = app_users[users[i]];

        const playerIdSender = getKeyByValue(app_users, socketIdSender);

        const result = {
          message,
          users: usersData,
        };

        if (playerIdSender) {
          io.to(socketIdSender).emit(emit, result);
        }
      }
    };

    const sendSingleUserError = async (userId, emit, message) => {
      const socketIdSender = app_users[userId];

      const playerIdSender = getKeyByValue(app_users, socketIdSender);

      const result = {
        message,
      };

      if (playerIdSender) {
        io.to(socketIdSender).emit(emit, result);
      }
    };

    socket.on("start_live_by_user", async (data) => {
      try {
        const { userId } = data;

        liveUser.push({ userId, joinUser: [userId], chat: [] });

        const findHostIndex = liveUser.findIndex(
          (item) => item.userId === userId
        );

        await sendAllLiveUsersResponse(
          [userId],
          "start_live",
          "Start Live!",
          liveUser[findHostIndex]
        );
      } catch (err) {
        console.log("start_live_by_userlog...", err);
      }
    });

    socket.on("add_live_user", async (data) => {
      try {
        const { hostUserId, userId } = data;

        const findHostIndex = liveUser.findIndex(
          (item) => item.userId === hostUserId
        );

        if (findHostIndex > -1) {
          liveUser[findHostIndex].joinUser.push(userId);

          await sendAllLiveUsersResponse(
            liveUser[findHostIndex].joinUser,
            "joined_user",
            "Joined User!",
            liveUser[findHostIndex]
          );
        } else {
          console.log("add_live_userlog host is not found...");
          await sendSingleUserError(
            userId,
            "joined_user_error",
            "Host Not Found!"
          );
        }
      } catch (err) {
        console.log("add_live_userlog...", err);
      }
    });

    socket.on("message_live_user", async (data) => {
      try {
        const { hostUserId, userId, message } = data;

        const findHostIndex = liveUser.findIndex(
          (item) => item.userId === hostUserId
        );

        if (findHostIndex > -1) {
          liveUser[findHostIndex].chat.push({ userId, message });

          await sendAllLiveUsersResponse(
            liveUser[findHostIndex].joinUser,
            "message_send",
            "Message Send!",
            liveUser[findHostIndex]
          );
        } else {
          console.log("add_live_userlog host is not found...");
          await sendSingleUserError(
            userId,
            "message_send_error",
            "Host Not Found!"
          );
        }
      } catch (err) {
        console.log("message_live_userlog...", err);
      }
    });

    socket.on("remove_user_in_live", async (data) => {
      try {
        const { hostUserId, userId } = data;

        const findHostIndex = liveUser.findIndex(
          (item) => item.userId === hostUserId
        );

        if (findHostIndex > -1) {
          if (hostUserId === userId) {
            liveUser.splice(findHostIndex, 1);
            await sendAllLiveUsersResponse(
              [userId],
              "stop_live",
              "Live Stop!",
              liveUser[findHostIndex]
            );
          } else {
            const index = liveUser[findHostIndex].joinUser.indexOf(userId);
            if (index !== -1) {
              liveUser[findHostIndex].joinUser.splice(index, 1);
            }

            await sendAllLiveUsersResponse(
              liveUser[findHostIndex].joinUser,
              "remove_user",
              "Remove User!",
              liveUser[findHostIndex]
            );
          }
        } else {
          console.log("remove_user_in_livelog host is not found...");
          await sendSingleUserError(
            userId,
            "remove_user_error",
            "Host Not Found!"
          );
        }
      } catch (err) {
        console.log("remove_user_in_livelog...", err);
      }
    });

    socket.on("stop_live", async (data) => {
      try {
        const { userId } = data;

        const findHostIndex = liveUser.findIndex(
          (item) => item.userId === userId
        );

        if (findHostIndex > -1) {
          liveUser.splice(findHostIndex, 1);
          await sendAllLiveUsersResponse(
            [userId],
            "stop_live",
            "Live Stop!",
            liveUser[findHostIndex]
          );
        } else {
          console.log("stop_livelog host is not found...");
          await sendSingleUserError(
            userId,
            "stop_live_error",
            "Host Not Found!"
          );
        }
      } catch (err) {
        console.log("stop_livelog...", err);
      }
    });

    socket.on("disconnecting", async (data) => {
      try {
        console.log("disconnect=======================", data);
        const playerId = getKeyByValue(app_users, socket.id);
        delete app_users[playerId];

        if (playerId) {
          const userData = await User.findOne({ _id: playerId }).select(
            "username email status"
          );

          if (userData) {
            userData.status = 0;
            await userData.save();
            socket.broadcast.emit("user_left", playerId);
          }
        }
      } catch (err) {
        console.log("Err disconnecting :", err);
      }
    });
  });
};
