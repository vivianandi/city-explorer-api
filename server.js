'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const locationApiKey = process.env.LOCATION_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;
const movieApiKey = process.env.MOVIE_API_KEY;

app.use(cors());

// Route definitions
app.get('/location', handleLocationRequest);
app.get('/weather', handleWeatherRequest);
app.get('/movies', getMovies);
app.get('*', handleNotFound);

// Route Handlers
async function handleLocationRequest(req, res) {
  const city = req.query.city;
  try {
    const location = await getLocation(city);
    res.json(location);
  } catch (error) {
    console.error("Error fetching location data:", error.message);
    res.status(500).send("Internal Server Error: Unable to fetch location data.");
  }
}

async function handleWeatherRequest(req, res) {
  const { lat, lon } = req.query;
  try {
    const weather = await getWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).send("Internal Server Error: Unable to fetch weather data.");
  }
}

async function getLocation(city) {
  const locationUrl = `https://us1.locationiq.com/v1/search.php?key=${locationApiKey}&q=${city}&format=json`;
  const locationResponse = await axios.get(locationUrl);
  if (locationResponse.data.length === 0) {
    throw new Error('Location not found');
  }
  const locationData = locationResponse.data[0];
  return new Location(locationData);
}

async function getWeather(lat, lon) {
  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherApiKey}&lat=${lat}&lon=${lon}&days=5&units=I`;
  const weatherResponse = await axios.get(weatherUrl);
  return weatherResponse.data.data.map(day => new Weather(day));
}

async function getMovies(req, res) {
  const city = req.query.city;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${city}`;
  const axiosResponse = await axios.get(url);
  const movieData = axiosResponse.data.results;
  res.json(movieData.map(movie => new Movie(movie)));
}

function handleNotFound(req, res) {
  res.status(404).send('404 Error');
}

class Weather {
  constructor(weatherData) {
    this.date = weatherData.valid_date;
    this.forecast = weatherData.weather.description;
    this.low = weatherData.low_temp;
    this.high = weatherData.high_temp;
  }
}

class Location {
  constructor(locationData) {
    this.name = locationData.display_name;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
  }
}

class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
    this.popularity = movieData.popularity;
    this.released_on = movieData.release_date;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

