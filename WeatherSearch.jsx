import React, { useState } from 'react';
import axios from 'axios';
import Weather from './Weather'; // Import the Weather component

const WeatherSearch = ({ onWeatherData }) => {
  const [city, setCity] = useState('');
  const [forecastData, setForecastData] = useState(null); // State to store forecast data

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const locationResponse = await axios.get(`/location?city=${city}`);
      const { lat, lon } = locationResponse.data;
      const weatherResponse = await axios.get(`/weather?lat=${lat}&lon=${lon}`);
      const weatherData = weatherResponse.data;
      setForecastData(weatherData); // Set forecast data when received
      onWeatherData(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="weather-search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {/* Conditional rendering of Weather component */}
      {forecastData && <Weather data={forecastData} />}
    </div>
  );
};

export default WeatherSearch;

