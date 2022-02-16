const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;

const LAUNCH_SPACEX_API = `https://api.spacexdata.com/v4/launches/query`;

async function populateLaunches() {
  console.log("Downloading Launches data....");

  const response = await axios.post(LAUNCH_SPACEX_API, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Launches Failed when Downloading");
    throw new Error("Error downloading Launches");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    await saveLaunches(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded..");
  } else {
    await populateLaunches();
  }
}

async function getAllLaunches({ skip, limit }) {
  return await launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunches(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFlightNumber() {
  const latestFlightNumber = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if (!latestFlightNumber) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestFlightNumber.flightNumber;
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function launchesWithIdExist(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function abortLaunchById(launchId) {
  const launchesAbort = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return launchesAbort.modifiedCount === 1;
}

async function scheduledNewLaunches(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No Planets was found !");
  }

  const incrementFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    customers: ["MUQORROBIN", "NASA"],
    upcoming: true,
    success: true,
    flightNumber: incrementFlightNumber,
  });

  await saveLaunches(newLaunch);
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduledNewLaunches,
  launchesWithIdExist,
  abortLaunchById,
};
