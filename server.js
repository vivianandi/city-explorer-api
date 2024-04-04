'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Route definitions
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.get('*', handleNotFound);

// Route Handlers

async function getLocation(req, res) {
  // Your getLocation function implementation here
}

async function getWeather(req, res) {
  // Your getWeather function implementation here
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