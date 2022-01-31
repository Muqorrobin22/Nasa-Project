const launches = new Map();

let NewFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function launchesWithIdExist(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const abortedId = launches.get(launchId);
  abortedId.upcoming = false;
  abortedId.success = false;

  return abortedId;
}

function postLaunches(launch) {
  NewFlightNumber++;
  launches.set(
    NewFlightNumber,
    Object.assign(launch, {
      flightNumber: NewFlightNumber,
      cusotmer: ["Muqorrobin", "Nasa"],
      upcoming: true,
      success: true,
    })
  );
}

module.exports = {
  getAllLaunches,
  postLaunches,
  launchesWithIdExist,
  abortLaunchById,
};
