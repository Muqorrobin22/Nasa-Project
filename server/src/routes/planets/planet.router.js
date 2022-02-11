const express = require("express");
const { httpGetAllPlanets } = require("./planet.controller");

const Router = express.Router();

const RoutePlanets = Router.get("/", httpGetAllPlanets);

module.exports = RoutePlanets;
