const express = require("express");

const api = express.Router();

const RoutePlanets = require("./planets/planet.router");
const RouteLaunches = require("./launches/launches.router");

api.use("/planets", RoutePlanets);
api.use("/launches", RouteLaunches);

module.exports = api;
