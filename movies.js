const axios = require('axios');
const movieApiKey = process.env.MOVIE_API_KEY;

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

async function getMovies(city) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${city}`;
  const axiosResponse = await axios.get(url);
  return axiosResponse.data.results.map(movie => new Movie(movie));
}

module.exports = getMovies;
