import React, { useState } from 'react';
import WeatherSearch from './WeatherSearch';
import Weather from './Weather'; // Import the Weather component

const App = () => {
  const [weatherData, setWeatherData] = useState(null); // State to store weather data

  // Function to handle weather data received from WeatherSearch component
  const handleWeatherData = (data) => {
    setWeatherData(data);
  };

  return (
    <div className="app">
      <h1>City Explorer</h1>
      {/* Pass the handleWeatherData function to the WeatherSearch component */}
      <WeatherSearch onWeatherData={handleWeatherData} />
      {/* Conditional rendering of Weather component */}
      {weatherData && <Weather data={weatherData} />}
    </div>
  );
};

export default App;
