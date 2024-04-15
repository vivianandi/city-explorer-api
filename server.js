'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const getWeather = require('./weather');
const getMovies = require('./movies');

const app = express();
const PORT = process.env.PORT || 3000;

const locationApiKey = process.env.LOCATION_API_KEY;

app.use(cors());

class Location {
  constructor(locationData) {
    this.name = locationData.display_name;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
  }
}

app.get('/location', async (req, res) => {
  const city = req.query.city;
  try {
    const location = await getLocation(city);
    res.json(location);
  } catch (error) {
    console.error("Error fetching location data:", error.message);
    res.status(500).send("Internal Server Error: Unable to fetch location data.");
  }
});

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const weather = await getWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).send("Internal Server Error: Unable to fetch weather data.");
  }
});

app.get('/movies', async (req, res) => {
  const city = req.query.city;
  try {
    const movies = await getMovies(city);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    res.status(500).send("Internal Server Error: Unable to fetch movie data.");
  }
});

app.get('*', (req, res) => {
  res.status(404).send('404 Error');
});

async function getLocation(city) {
  const locationUrl = `https://us1.locationiq.com/v1/search.php?key=${locationApiKey}&q=${city}&format=json`;
  const locationResponse = await axios.get(locationUrl);
  if (locationResponse.data.length === 0) {
    throw new Error('Location not found');
  }
  const locationData = locationResponse.data[0];
  return new Location(locationData);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
