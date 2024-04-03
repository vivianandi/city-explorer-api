'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const weatherData = require('./data/weather.json');

// Define Forecast class
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const app = express();
const PORT = process.env.PORT || 5501;

// Middleware
app.use(cors());

// Home route
app.get('/', (request, response) => {
  response.send('<h1>Welcome to City Explorer API!</h1>');
});

// Weather route
app.get('/weather', getWeather);

// Location route
app.get('/location', getLocation);

// Helper Functions

async function getWeather(request, response) {
  const { lat, lon, searchQuery } = request.query;

  // Find the city based on latitude, longitude, and search query
  const city = weatherData.find(city => {
    return city.lat === lat && city.lon === lon && city.city_name.toLowerCase() === searchQuery.toLowerCase();
  });

  // If city not found or not supported, return an error
  if (!city || !['Seattle', 'Paris', 'Amman'].includes(city.city_name)) {
    return response.status(404).json({ error: 'City not found or not supported' });
  }

  // Proceed to fetch weather data for the city
  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

  try {
    const weatherResponse = await axios.get(weatherUrl);
    const cityForecasts = weatherResponse.data.data.map(element => (
      new Forecast(element.datetime, `Low of ${element.low_temp}, high of ${element.max_temp} with ${element.weather.description}`)
    ));
    response.status(200).json(cityForecasts);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
}

async function getLocation(request, response) {
  const { city } = request.query;

  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_API_KEY}&q=${city}&format=json`;

  try {
    const locationResponse = await axios.get(url);
    response.json(locationResponse.data[0]);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/*
In this structure:
The server listens on port 5500.
There are two routes defined: /weather for fetching weather data and /location for fetching location data.
The getWeather function retrieves weather data based on latitude and longitude coordinates.
The getLocation function retrieves location data based on a city query parameter.
Both routes handle errors appropriately and send back relevant responses to the client.
*/