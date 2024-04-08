'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const accessToken = process.env.VITE_LOCATION_ACCESS_TOKEN;
console.log("Access Token", accessToken);
const API = process.env.VITE_API_URL;

// Route definitions
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.get('*', handleNotFound);

// Route Handlers

async function getLocation(req, res) {
  try {
    const city = req.query.city;
    const apiKey = process.env.LOCATION_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${accessToken}&q=${city}&format=json`;

    const axiosResponse = await axios.get(url);
    const locationData = axiosResponse.data[0];

    if (!locationData) {
      // If location data is empty or undefined, send a 404 Not Found response
      res.status(404).send('Location not found');
      return;
    }

    const location = new Location(locationData);

    res.json(location);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getWeather(req, res) {
  try {
    const { latitude, longitude } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${apiKey}&lat=${latitude}&lon=${longitude}&days=5&units=I`;

    const axiosResponse = await axios.get(url);
    const weatherData = axiosResponse.data.data;

    const weather = weatherData.map(day => new Weather(day));

    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getMovies(req, res) {
  try {
    const city = req.query.city;
    const apiKey = process.env.MOVIE_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${city}`;

    const axiosResponse = await axios.get(url);
    const movieData = axiosResponse.data.results;

    const movies = movieData.map(movie => new Movie(movie));

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).send('Internal Server Error');
  }
}

function handleNotFound(req, res) {
  res.status(404).send('404 Error');
}

// Weather class for formatting weather data
class Weather {
  constructor(weatherData) {
    this.date = weatherData.valid_date;
    this.forecast = weatherData.weather.description;
    this.low = weatherData.low_temp;
    this.high = weatherData.high_temp;
  }
}

// Movie class for formatting movie data
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

// Location class for formatting location data
class Location {
  constructor(locationData) {
    this.name = locationData.display_name;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
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