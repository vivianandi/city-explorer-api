const axios = require('axios');
const weatherApiKey = process.env.WEATHER_API_KEY;

class Weather {
  constructor(weatherData) {
    this.date = weatherData.valid_date;
    this.forecast = weatherData.weather.description;
    this.low = weatherData.low_temp;
    this.high = weatherData.high_temp;
  }
}

async function getWeather(lat, lon) {
  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherApiKey}&lat=${lat}&lon=${lon}&days=5&units=I`;
  const weatherResponse = await axios.get(weatherUrl);
  return weatherResponse.data.data.map(day => new Weather(day));
}

module.exports = getWeather;
