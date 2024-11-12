const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const app = express();
const { isCelebrateError } = require("celebrate");

// Init Router
const env = require("./app/config/env");
const connect = require("./app/config/database");
const routes = require("./app/routes");

// define global variable
global.appRoot = path.resolve(__dirname);

// Routes initialization
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
routes(app);

// API Health check
app.all("/api/health-check", (req, res) =>
  res.status(200).json({
    status: 200,
    message: `Working Fine - ENV: ${String(env.NODE_ENV)}`,
  })
);

app.get("/", async (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: "Hello | Aiastrology Backend" });
});

const HistoryCall = require("./app/models/history-call");
const User = require("./app/models/user");
const { checkTimeAndCutBalance } = require("./app/socket/socket_handler");

// i have create cron job for the timeBalance is low or not
cron.schedule("*/10 * * * * *", async () => {
  // console.log("node-cron...");

  const getAllStartingCall = await HistoryCall.find({ status: "Starting" });

  if (getAllStartingCall.length > 0) {
    // console.log("find startings call...");

    for (let i = 0; i < getAllStartingCall.length; i++) {
      const getUser = await User.findById(getAllStartingCall[i].userId).select(
        "timeBalance"
      );
      // console.log("getUser...", getUser);

      const start_time = new Date(getAllStartingCall[i].start_time);
      const end_time = new Date();
      const differenceInSeconds = (end_time - start_time) / 1000;

      if (getUser?.timeBalance > differenceInSeconds) {
        // time balance is enough.
        // console.log("time balance is enough.");
      } else {
        // time balance is low.
        // console.log("time balance is low.");
        await checkTimeAndCutBalance(
          getAllStartingCall[i]?.userId,
          differenceInSeconds
        );

        await HistoryCall.findByIdAndUpdate(getAllStartingCall[i]._id, {
          $set: {
            end_time,
            time: differenceInSeconds,
            status: "AutoClosed",
          },
        }).select("historyCallId");
      }
    }
  } else {
    // not find starting calls...
    // console.log("not find starting calls...");
  }
});

const axios = require("axios");
app.get("/aistrology-one", async (req, res) => {
  try {
    console.log("check...");

    const username = "633323";
    const password = "7a881d0ea57f30213be9e2c9b60e183b97cb1c3d";

    // Encode the credentials in base64
    const auth = btoa(`${username}:${password}`);

    const data = {
      day: 17,
      month: 4,
      year: 2001,
      hour: 11,
      min: 45,
      lat: 25.7464,
      lon: 82.6837,
      tzone: 5.5,
    };

    let astro_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://json.astrologyapi.com/v1/astro_details",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: JSON.stringify(data),
    };
    const astroData = await axios.request(astro_config);

    let planets_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://json.astrologyapi.com/v1/planets",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: JSON.stringify(data),
    };
    const planetsData = await axios.request(planets_config);

    let vdasha_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://json.astrologyapi.com/v1/current_vdasha",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: JSON.stringify(data),
    };
    const vdashaData = await axios.request(vdasha_config);

    return res.json({
      status: true,
      message: {
        astro: astroData.data,
        planets: planetsData.data,
        vdasha: vdashaData.data,
      },
    });
  } catch (err) {
    console.log("check err...", err);
  }
});

app.post("/aistrology-two", async (req, res) => {
  try {
    const { day, month, year, hour, min, lat, lon, tzone, name } = req.body;

    const username = "634820";
    const password = "c545ff3cb6dedd4e4b1d2727a4e98f2d1c06ce86";

    // Encode the credentials in base64
    const auth = btoa(`${username}:${password}`);

    const data = {
      day,
      month,
      year,
      hour,
      min,
      lat,
      lon,
      tzone,
      name,
    };

    let numero_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://json.astrologyapi.com/v1/numero_table",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: JSON.stringify(data),
    };
    const numeroData = await axios.request(numero_config);

    let basic_panchang_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://json.astrologyapi.com/v1/basic_panchang",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: JSON.stringify(data),
    };
    const basicPanchangData = await axios.request(basic_panchang_config);

    let general_ascendant_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://json.astrologyapi.com/v1/general_ascendant_report",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: JSON.stringify(data),
    };
    const generalAscendantData = await axios.request(general_ascendant_config);

    return res.json({
      status: true,
      message: {
        numero: numeroData.data,
        basicPanchang: basicPanchangData.data,
        generalAscendant: generalAscendantData.data,
      },
    });
  } catch (err) {
    console.log("check err...", err);
    return res.json({ status: false, message: err });
  }
});
// Invalid Route
app.all("/api/*", (req, res) =>
  res.status(400).json({ status: 400, message: "Bad Request" })
);

const { MulterError } = require("multer");
let errorHandling = (err, req, res, next) => {
  let message = err.message;
  console.log("err::", err);
  if (isCelebrateError(err)) {
    message = "Invalid validation error";
    console.log("Joi validation err...", err);
    const errorBody = err.details.get("body");
    const errorParams = err.details.get("params");
    const errorQuery = err.details.get("query");

    const {
      details: [errorDetails],
    } = errorBody || errorParams || errorQuery;

    if (errorDetails?.message)
      message = errorDetails.message.replace(/['"]+/g, ""); // Remove double quotes

    return res.status(400).send({ status: false, statusCode: 400, message });
  } else if (MulterError) {
    return res.status(400).send({ status: false, statusCode: 400, message });
  } else {
    return next(err);
  }
};
app.use(errorHandling);

// start the server & connect to Mongo
connect(env.DB_CONNECTION_STRING)
  .then(async () => {
    console.log("Database Connected...");
  })
  .catch((e) => {
    console.log("e :::", e);
    if (e.name === "MongoParseError") {
      console.error(
        `\n\n${e.name}: Please set NODE_ENV to "production", "development", or "staging".\n\n`
      );
    } else if (e.name === "MongoNetworkError") {
      console.error(`\n\n${e.name}: Please start MongoDB...\n\n`);
    } else {
      console.log(e);
    }
  });

//Socket Code
const Http = require("http").createServer(app);
const socketConnection = require("./app/socket/socket");
socketConnection(Http);

module.exports = { Http };
