const {
  getAllLaunches,
  postLaunches,
  launchesWithIdExist,
  abortLaunchById,
} = require("../../models/launch.model");

function httpGetAllLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function AddnNewLaunch(req, res) {
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

  postLaunches(launch);
  return res.status(201).json(launch);
}

function abortLaunches(req, res) {
  const launchId = Number(req.params.id);

  if (!launchesWithIdExist(launchId)) {
    return res.status(404).json({
      error: "Launch Not Found!",
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  AddnNewLaunch,
  abortLaunches,
};
