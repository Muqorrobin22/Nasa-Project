const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  try {
    return res.status(200).json(await getAllPlanets());
  } catch (error) {
    return res.status(404).json({
      error: "Error cok",
    });
  }
}

module.exports = {
  httpGetAllPlanets,
};
