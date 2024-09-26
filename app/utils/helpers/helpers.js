const bCrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const { isEmpty, isString } = require("../validator");

const { default: mongoose } = require("mongoose");

/**
 * @param {Object} res // admin
 * @param {String} status ok | error
 * @param {String} msg Response message
 * @param {Object|Array} payload Array or Object
 * @param {Object} other This can be other object that user wants to add
 */
exports.createResponse = (res, status, message, payload, statusCode) => {
  if (status) statusCode = 200;
  else statusCode = statusCode || 400;
  res.json({
    status,
    message,
    data: payload,
    statusCode,
  });
};

exports.getKeyByValue = (object, value) => {
  try {
    return Object.keys(object).find((key) => object[key] === value);
  } catch (err) {
    console.log("getKeyByValuelog err?.message:::", err?.message);
  }
};

/**
 * @param {Object} res
 * @param {Object} error
 * @param {Object} options
 */
exports.createError = (res, error) => {
  const message =
    (error && error.message) ||
    (isString(error) && error) ||
    "Internal Server Error";
  const stackTrace = error || message;

  console.error("ERROR:", message, stackTrace);

  res.locals.errorStr = message;

  res.status(500).json({
    status: false,
    statusCode: 500,
    message,
  });
};

/**
 * @param {Object} res
 * @param {String} message
 * @param {Object} options
 */
exports.createServiceUnavailableError = (res, message, options = undefined) => {
  if (!options) options = {};
  if (!options.other) options.other = {};

  console.error("Service unavailable error:", message);

  return res.status(503).json({
    status: "error",
    message,
    ...options.other,
  });
};

/**
 * @param {Object} res
 * @param {Object} errors
 */
exports.createValidationResponse = (res, errors) =>
  res.status(400).json({
    status: "error",
    message: errors[Object.keys(errors)[0]],
    errors: {
      ...errors,
    },
  });

/**
 * @description Generate Hashed password
 * @param {String} password
 */
exports.generateHash = (password) =>
  bCrypt.hashSync(password, bCrypt.genSaltSync(8));

/**
 * @descs Compare encrypted passwords
 * @param {*} userpass
 * @param {*} password
 */
exports.comparePassword = (password, DbPassword) =>
  bCrypt.compareSync(password, DbPassword);

/**
 * @description Get Array From String
 * @param {String} str
 */
exports.arrayFromString = (str) => {
  const newStr = str.slice(2, str.length - 2);
  const replacedStr = newStr.replace(/“|”|"/g, "");
  const array = replacedStr.split(",").map(String);
  return array;
};

/**
 * @description Convert String to Object Key
 * @param {String} str
 */
exports.stringToKey = (str) => {
  const newStr = str.replace(/ /g, "_");
  return newStr;
};

/**
 * @description Create valid Object Key
 * @param {String} str
 */
exports.createValidKey = (str) => {
  const newStr = str.replace(/-| |_/g, "_");
  return newStr;
};

/**
 * @description Get Default sort Order
 * @param sortOrder
 */
exports.getDefaultSortOrder = (sortOrder) => {
  const order =
    !isEmpty(sortOrder) && ["ASC", "DESC"].indexOf(sortOrder) !== -1
      ? sortOrder
      : "DESC";
  return order;
};

/**
 * @description encode string to base64 string
 * @param data string
 */
exports.encodingToBase64 = (data) => {
  if (!data) return data;
  const buff = new Buffer.from(data);
  return buff.toString("base64");
};

/**
 * @description decode base64 to string
 * @param data base64 string
 */
exports.decodeBase64ToString = (data) => {
  if (!data) return data;
  const buff = new Buffer.from(data, "base64");
  return buff.toString("utf8");
};

exports.isEmail = (value) => {
  // eslint-disable-next-line max-len
  const myRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = myRegEx.test(value);
  return !!isValid;
};

exports.getUserDataId = (user) => {
  if (user) {
    if (user.data_uid) return user.data_uid;
    return user.id;
  }
};

exports.mathRounding = (num, digit = 2) => {
  const result = parseFloat(num).toFixed(digit);
  // eslint-disable-next-line no-restricted-globals
  if (result && isNaN(result) === false) return Number(result);
  return 0;
};

exports.groupBy = (collection, iteratee) => {
  const groupResult = _.groupBy(collection, iteratee);
  return Object.keys(groupResult).map((key) => ({
    name: key,
    value: groupResult[key],
  }));
};

exports.getDate = (date) => {
  if (date) date = new Date(date);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

exports.getRandomValue = function (len, str) {
  try {
    let randomValue = "";
    for (let i = 0; i < len; i++) {
      const value = Math.floor(Math.random() * str.length);
      randomValue += str.substring(value, value + 1).toUpperCase();
    }
    return randomValue;
  } catch (err) {
    console.log(err);
  }
};

exports.generateReferCode = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  return randomCode;
};

exports.generateReferCode = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";

  do {
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }
  } while (await GameProvider.exists({ refercode: randomCode }));

  return randomCode;
};

exports.calculateCommission = async (referredById) => {
  referredById = new mongoose.Types.ObjectId(referredById);
  // find total amount & commisionRate
  let totalBet = await History.aggregate([
    {
      $match: {
        playerId: referredById,
        note: 2, // bet
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  totalBet = totalBet[0] ? totalBet[0].totalAmount : 0;

  // total win
  let totalWin = await History.aggregate([
    {
      $match: {
        playerId: referredById,
        note: 2, // bet
        winAmount: { $ne: 0, $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$winAmount" },
      },
    },
  ]);
  totalWin = totalWin[0] ? totalWin[0].totalAmount : 0;
  console.log("totalBet::", totalBet);
  console.log("totalWin::", totalWin);

  // commision rate
  let settingData = await Setting.findOne();
  const commissionRate = settingData?.commissionRate;

  // Calculate edge as decimal
  const edgeAsDecimal = totalWin - totalBet;

  // Calculate the dynamic wagered value as a percentage difference
  const percentageDifference = (totalWin / totalBet) * 100;
  console.log("percentageDifference::", percentageDifference);
  const wagered = ((percentageDifference - 100) * 5) / 100;
  console.log("wagered::", wagered);

  // Calculate commission based on the commission rate and player's activity
  const commission = edgeAsDecimal * (wagered / 100 / 2) * commissionRate;
  console.log("commission::", commission);
  return { commission, wagered };
};

exports.getRandomValue = function (len, str) {
  try {
    // const str = '1234567890'; //Random Generate Every Time From This Given Char

    let randomvalue = "";
    for (let i = 0; i < len; i++) {
      const value = Math.floor(Math.random() * str.length);
      randomvalue += str.substring(value, value + 1).toUpperCase();
    }

    return randomvalue;
  } catch (err) {
    console.log(err);
    return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

exports.generateGameID = async () => {
  const genId = () => Math.floor(10000000 + Math.random() * 90000000); // Generate a random 8-digit ID
  let randomID = genId();
  while (await Game.findOne({ gameID: randomID })) {
    randomID = genId();
  }
  return randomID;
};

exports.generateGameDevID = async () => {
  const genId = () => Math.floor(10000000 + Math.random() * 90000000); // Generate a random 8-digit ID
  let randomID = genId();
  while (await Game.findOne({ gameIdDev: randomID })) {
    randomID = genId();
  }
  return randomID;
};

exports.generateGameProviderID = async () => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let randomId = "";

  do {
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
  } while (await GameProvider.exists({ providerId: randomId }));

  return randomId;
};

exports.transformArrayToObject = () => {
  const access = {};

  array.forEach((category) => {
    category.children.forEach((item) => {
      const key = `${item.title.replace(/\s/g, "")}`;
      access[key] = "false";

      item.permissions.forEach((permission) => {
        const permissionKey = `${key}${permission.name}`;
        access[permissionKey] = permission.allowed.toString();
      });
    });
  });

  return access;
};

exports.shortenPermissions = (originalData) => {
  const shortenedData = {};

  originalData.forEach((category) => {
    const categoryTitle = category.title;
    shortenedData[categoryTitle] = {};

    category.children.forEach((child) => {
      const childTitle = child.title;
      const permissions = child.permissions
        .filter((permission) => permission.allowed)
        .map((permission) => permission.name);

      if (permissions.length > 0) {
        shortenedData[categoryTitle][childTitle] = permissions;
      }
    });
  });

  return shortenedData;
};

exports.updatePermissions = (mainArray, adminArray) => {
  let updatedAdminArray = JSON.parse(JSON.stringify(adminArray)); // Deep copy to avoid modifying the original array

  mainArray.forEach((mainItem) => {
    const adminItem = updatedAdminArray.find(
      (item) => item.title === mainItem.title
    );

    if (adminItem) {
      mainItem.children.forEach((mainChild) => {
        const adminChildIndex = adminItem.children.findIndex(
          (child) => child.title === mainChild.title
        );

        if (adminChildIndex !== -1) {
          // Update existing child permissions
          const adminChild = adminItem.children[adminChildIndex];
          mainChild.permissions.forEach((mainPermission) => {
            const adminPermissionIndex = adminChild.permissions.findIndex(
              (permission) => permission.name === mainPermission.name
            );

            if (adminPermissionIndex !== -1) {
              // Update existing child permissions only if mainPermission.allowed is undefined
              if (mainPermission.allowed === undefined) {
                const adminPermission =
                  adminChild.permissions[adminPermissionIndex];
                adminPermission.allowed = mainPermission.allowed;
              }
            } else {
              // If the permission is not found in admin array, add the entire permission object
              adminChild.permissions.push({
                name: mainPermission.name,
                allowed: mainPermission.allowed,
              });
            }
          });

          // Remove extra permissions in admin array
          adminChild.permissions = adminChild.permissions.filter(
            (adminPermission) => {
              return mainChild.permissions.some(
                (mainPermission) => mainPermission.name === adminPermission.name
              );
            }
          );
        } else {
          // If the child is not found in admin array, add the entire child object
          adminItem.children.push({
            title: mainChild.title,
            permissions: mainChild.permissions,
          });
        }
      });

      // Remove extra children in admin array
      adminItem.children = adminItem.children.filter((adminChild) => {
        return mainItem.children.some(
          (mainChild) => mainChild.title === adminChild.title
        );
      });
    } else {
      // If the item is not found in admin array, add the entire item object
      updatedAdminArray.push({
        title: mainItem.title,
        children: mainItem.children,
      });
    }
  });

  // Remove extra items in admin array
  updatedAdminArray = updatedAdminArray.filter((adminItem) => {
    return mainArray.some((mainItem) => mainItem.title === adminItem.title);
  });

  return updatedAdminArray;
};

exports.randomKeyString = (length, chars) => {
  var mask = "";
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:;<>?,.";
  var result = "";
  for (var i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
};

exports.getRandomValue = (str = "1234567890", length = 4) => {
  // const str = '1234567890'; //Random Generate Every Time From This Given Char
  // const length = 4;

  let randomValue = "";
  for (let i = 0; i < length; i++) {
    const value = Math.floor(Math.random() * str.length);
    randomValue += str.substring(value, value + 1).toUpperCase();
  }

  return randomValue;
};
