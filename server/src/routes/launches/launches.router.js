const express = require("express");
const {
  httpGetAllLaunches,
  AddnNewLaunch,
  abortLaunches,
} = require("./launches.controller");

const RouteLaunches = express.Router();

RouteLaunches.get("/", httpGetAllLaunches);
RouteLaunches.post("/", AddnNewLaunch);
RouteLaunches.delete("/:id", abortLaunches);

module.exports = RouteLaunches;
