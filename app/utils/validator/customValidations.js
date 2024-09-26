const isJSON = require("validator/lib/isJSON");

/**
 * @description Check if id is valid mongodb id
 * @param {*} str
 */
exports.isValidId = (id) => {
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description Check if variable is undefined or not
 * @param {*} str
 */
exports.isEmpty = (value) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description Check if String and doesn't contain space and special chracters
 * @param {String} str
 */
exports.isValidString = (str) => {
  var regExp = /^[a-zA-Z]+$/;
  if (typeof str !== "string") {
    return false;
  } else if (!str.match(regExp)) {
    return false;
  } else {
    return true;
  }
};

/**
 * @description Custom RegEx
 * @param {String} str
 * @param {String} regEx
 */
exports.customRegex = (str, regEx) => {
  if (typeof str !== "string") {
    return false;
  } else if (!regEx.test(str)) {
    return false;
  } else {
    return true;
  }
};

/**
 * @desc Checks for valid email
 * @param {String} value // Accepts string
 */
exports.isEmail = (value) => {
  var email = value;
  var myRegEx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var isValid = myRegEx.test(email);
  if (isValid) {
    return true;
  } else {
    return false;
  }
};

/**
 * @desc Checks for valid array
 * @param {*} value
 */
exports.isArray = (value) => {
  if (typeof value === "string") {
    const replaced = value.replace(/'/g, '"');
    if (!isJSON(replaced)) {
      return false;
    } else {
      const parsed = JSON.parse(replaced);
      if (parsed.constructor === Array) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    if (value.constructor === Array) {
      return true;
    } else {
      return false;
    }
  }
};

/**
 * @description Is Valid Date
 * @param {String} d
 */
exports.isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

/**
 * @description Check if valid string
 * @param {String} value
 */
exports.isString = (value) => {
  return typeof value === "string" || value instanceof String;
};

/**
 * @desc Checks if given value is Decimal Number
 * @param {*} value // Accepts string
 */
exports.isDecimalNumber = (value) => {
  var number = value;
  var myRegEx = /^\d+(\.\d+)?$/;
  var isValid = myRegEx.test(number);
  if (isValid) {
    return true;
  } else {
    return false;
  }
};

/**
 * @desc Checks if given value is Number
 * @param {*} value // Accepts string
 */
exports.isNumber = (value) => {
  var number = value;
  var myRegEx = /^(\s*[0-9]+\s*)+$/;
  var isValid = myRegEx.test(number);
  if (isValid) {
    return true;
  } else {
    return false;
  }
};

/**
 * @desc Checks if given value is Boolean
 * @param {*} value // Accepts string
 */
exports.isBoolean = (value) => {
  if (typeof value === "boolean") {
    return true;
  } else {
    return false;
  }
};

/**
 * @desc Generate Unique History Id
 * @param {*} value // Accepts string
 */
exports.genrateUniqueHistoryId = async (historyIdArray) => {
  const historyIdValue = Math.floor(1000000000 + Math.random() * 9000000000);
  let historyIdBool = false;

  for (let i = 0; i < historyIdArray.length; i++) {
    if (historyIdArray[i].historyId == historyIdValue) {
      historyIdBool = true;
    }
  }

  return new Promise(async (resolve, reject) => {
    if (historyIdBool) {
      getRoomIdUnique(historyIdArray);
    } else {
      resolve(historyIdValue);
    }
  });
};

/**
 * @desc Generate Unique Player Id
 * @param {*} value // Accepts string
 */
exports.genrateUniquePlayerId = async (playerIdArray) => {
  const playerIdValue = Math.floor(10000000 + Math.random() * 90000000);
  let playerIdBool = false;

  for (let i = 0; i < playerIdArray.length; i++) {
    if (playerIdArray[i].playerId == playerIdValue) {
      playerIdBool = true;
    }
  }

  return new Promise(async (resolve, reject) => {
    if (playerIdBool) {
      getRoomIdUnique(playerIdArray);
    } else {
      resolve(playerIdValue);
    }
  });
};

/**
 * @desc Generate Unique Game Id
 * @param {*} value // Accepts string
 */
exports.genrateUniqueGameId = async (gameIdArray) => {
  const gameIdValue = Math.floor(10000000 + Math.random() * 90000000);
  let gameIdBool = false;

  for (let i = 0; i < gameIdArray.length; i++) {
    if (gameIdArray[i].gameId == gameIdValue) {
      gameIdBool = true;
    }
  }

  return new Promise(async (resolve, reject) => {
    if (gameIdBool) {
      getRoomIdUnique(gameIdArray);
    } else {
      resolve(gameIdValue);
    }
  });
};

/**
 * @desc Generate Coin Shop Package Id
 * @param {*} value // Accepts string
 */
exports.genrateUniquePackageId = async (packageIdArray) => {
  const packageIdValue = Math.floor(10000000 + Math.random() * 90000000);
  let packageIdBool = false;

  for (let i = 0; i < packageIdArray.length; i++) {
    if (packageIdArray[i].packageId == packageIdValue) {
      packageIdBool = true;
    }
  }

  return new Promise(async (resolve, reject) => {
    if (packageIdBool) {
      getRoomIdUnique(packageIdArray);
    } else {
      resolve(packageIdValue);
    }
  });
};
