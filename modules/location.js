'use strict';

const axios = require('axios');

async function getLocation(req, res) {
  const city = req.query.city;
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.VITE_LOCATION_ACCESS_TOKEN}&q=${city}&format=json`;

  const axiosResponse = await axios.get(url);
  let locationData = axiosResponse.data;

  let location = new Location(locationData[0]);

  res.json(location);
}

class Location {
  constructor(locationData) {
    this.name = locationData.display_name;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
  }
}

module.exports = getLocation;

