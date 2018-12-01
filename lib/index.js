// This file is in the entry point in your webpack config.

const url = 'http://sweater-weather1141.herokuapp.com';

class WeatherData {
  constructor(data) {
    this.data = data;
  }

  currentForecast() {
    return this.data['data']['attributes']['currently']
  }

  hourlyForecast() {
    return this.data['data']['attributes']['hourly']
  }

  dailyForecast() {
    return this.data['data']['attributes']['daily']
  }
}

const getWeatherData = (location) => {
  fetch(`${url}/api/v1/forecast?location=${location}`)
    .then(response => response.json())
    .then(data => weatherData = new WeatherData(data))
    .then(updatePageData);
};

const updatePageData = () => {

};
