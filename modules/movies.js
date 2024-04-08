'use strict';

const axios = require('axios');

async function getMovies(req, res) {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const apiKey = process.env.MOVIE_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${city}`;

  const axiosResponse = await axios.get(url);
  const movieData = axiosResponse.data.results;

  const movies = movieData.map(movie => new Movie(movie));

  res.json(movies);
}

class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.averageVotes = movieData.vote_average;
    this.totalVotes = movieData.vote_count;
    this.imageUrl = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
    this.popularity = movieData.popularity;
    this.releasedOn = movieData.release_date;
  }
}

module.exports = getMovies;
