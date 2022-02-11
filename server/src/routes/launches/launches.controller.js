const {
  getAllLaunches,
  scheduledNewLaunches,
  launchesWithIdExist,
  abortLaunchById,
} = require("../../models/launch.model");

async function httpGetAllLaunches(req, res) {
  res.status(200).json(await getAllLaunches());
}

async function AddnNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing some properties",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Date Format",
    });
  }

  await scheduledNewLaunches(launch);
  return res.status(201).json(launch);
}

async function abortLaunches(req, res) {
  const launchId = Number(req.params.id);

  const ExistLaunchId = await launchesWithIdExist(launchId);

  if (!ExistLaunchId) {
    return res.status(404).json({
      error: "Launch Not Found!",
    });
  }

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      Error: "Error goblok",
    });
  }

  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  AddnNewLaunch,
  abortLaunches,
};
