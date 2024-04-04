import React from 'react';

const Weather = ({ data }) => {
  return (
    <div className="weather-container">
      <h2>Weather Forecast</h2>
      <div className="forecast-list">
        {data.map((forecast, index) => (
          <div key={index} className="forecast-item">
            {/* Render each forecast item here */}
            <p>Date: {forecast.date}</p>
            <p>Description: {forecast.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
