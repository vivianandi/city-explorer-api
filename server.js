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
app.get('/location', getLocation);
app.get('/movies', getMovies);
app.get('*', handleNotFound);

// Route Handlers

async function getLocation(req, res) {

  console.log("Request received for location data:", req.query.city);
  const city = req.query.city;
  const locationUrl = `https://us1.locationiq.com/v1/search.php?key=${locationApiKey}&q=${city}&format=json`;

  console.log("Location URL:", locationUrl);

  const locationResponse = await axios.get(locationUrl);
  const locationData = locationResponse.data[0];

  console.log("Location data received:", locationData);

  if (!locationData) {
    res.status(404).send('Location not found');
    return;
  }

  const { lat, lon } = locationData; // Extract latitude and longitude

  console.log("Latitude:", lat, "Longitude:", lon);

  // Construct URL for weather endpoint using latitude and longitude
  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherApiKey}&lat=${lat}&lon=${lon}&days=5&units=I`;

  console.log("Weather URL:", weatherUrl);

  // Fetch weather data using coordinates
  const weatherResponse = await axios.get(weatherUrl);
  const weatherData = weatherResponse.data.data;

  console.log("Weather data received:", weatherData);

  // Send back location and weather data to client
  const location = new Location(locationData);
  const weather = weatherData.map(day => new Weather(day));

  res.json({ location, weather });

}



async function getMovies(req, res) {
  try {
    const city = req.query.city;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${city}`;

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
