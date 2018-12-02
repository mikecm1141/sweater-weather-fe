// This file is in the entry point in your webpack config.

const url = 'http://sweater-weather1141.herokuapp.com';
var weatherData = {}

// Weather Data class
class WeatherData {
  constructor(data) {
    this.data = data;
  }

  currentLocation() {
    return this.data['data']['id'];
  }

  currentForecast() {
    return this.data['data']['attributes']['currently'];
  }

  hourlyForecast() {
    return this.data['data']['attributes']['hourly'];
  }

  dailyForecast() {
    return this.data['data']['attributes']['daily'];
  }
}

class DateFormatter {
  constructor(timestamp) {
    this.timestamp = timestamp;
  }

  currentFormat() {
    let dateTime = new Date(this.timestamp * 1000);
    let hourObject = this.formatHours(dateTime.getHours());
    let currentMinutes = ('0'+dateTime.getMinutes()).slice(-2);
    let currentMonth = dateTime.getMonth() + 1;
    let currentDate = dateTime.getDate();

    let dateString = `${hourObject['hour']}:${currentMinutes} ${hourObject['amPm']}, ${currentMonth}/${currentDate}`;

    return dateString;
  }

  hourlyFormat() {
    let dateTime = new Date(this.timestamp * 1000);
    let hourObject = this.formatHours(dateTime.getHours());

    let dateString = `${hourObject['hour']} ${hourObject['amPm']}`;

    return dateString;
  }

  formatHours(hour) {
    let amPm = 'AM';

      if (hour >= 12) {
        hour = hour - 12;
        amPm = 'PM';
      }

      if (hour === 0) {
        hour = 12;
      }

      return({hour: hour, amPm: amPm})
    }
}

// GET request for weather data based on inputted location
const getWeatherData = (location) => {
  fetch(`${url}/api/v1/forecast?location=${location}`)
    .then(response => response.json())
    .then(data => weatherData = new WeatherData(data))
    .then(updateCurrentData)
    .then(updateHourlyData)
    .then(updateDailyData)
    .catch(error => console.error({ error}));
};

// Update Current Weather
const updateCurrentData = () => {
  let stringTime = new DateFormatter(weatherData.currentForecast()['time']);

  $('#current-summary, #current-detailed').css('display', 'inherit');
  $('.currently-summary').text(weatherData.currentForecast()['summary']);
  $('#currently-temperature').text(Math.floor(weatherData.currentForecast()['temperature']));
  $('#daily-temperature-high').text(Math.floor(weatherData.dailyForecast()['data'][0]['temperatureHigh']));
  $('#daily-temperature-low').text(Math.floor(weatherData.dailyForecast()['data'][0]['temperatureLow']));
  $('#current-location').text(weatherData.currentLocation());
  $('#current-time').text(stringTime.currentFormat());
  $('#summary-daily').text(weatherData.dailyForecast()['summary']);
  $('#currently-apparent-temperature').text(Math.floor(weatherData.currentForecast()['apparentTemperature']) + '°F');
  $('#currently-humidity').text(Math.floor(weatherData.currentForecast()['humidity'] * 100) + '%');
  $('#currently-visibility').text(weatherData.currentForecast()['visibility'] + ' miles');
  $('#currently-uv-index').text(weatherData.currentForecast()['uvIndex']);
  $('#currently-precip-probability').text(weatherData.currentForecast()['precipProbability'] + '%');
  $('#currently-precip-intensity').text(weatherData.currentForecast()['precipIntensity'] + ' in');
  $('#currently-wind-speed').text(weatherData.currentForecast()['windSpeed'] + ' mph');
};

// Update Hourly Weather
const updateHourlyData = () => {
  $('.hourly-container').html('');

  for(let i = 0; i < 12; i++) {
    let stringTime = new DateFormatter(weatherData.hourlyForecast()['data'][i]['time']);

    $('.hourly-container').append(`
      <div class="hourly-item">
        <h5>${stringTime.hourlyFormat()}</h5>
        <h1><i class="wi wi-night-partly-cloudy"></i></h1>
        <h5>${Math.floor(weatherData.hourlyForecast()['data'][i]['temperature'])}&deg;</h5>
      </div>
    `);
  }
  $('#hourly').css('display', 'inherit');
}

// Update Daily Weather
const updateDailyData = () => {
  $('#daily').html('');

  for(let i = 0; i < 7; i++) {
    let dailyData = weatherData.dailyForecast()['data'][i];

    $('#daily').append(`
      <div class="daily-container">
        <div class="daily-day">
          <h5>${dailyData['time']}</h5>
        </div>

        <div class="daily-status">
          <i class="wi wi-day-sunny"></i><h5>${dailyData['summary']}</h5>
        </div>

        <div class="daily-precip">
          <i class="wi wi-raindrop"></i><h5>${dailyData['precipProbability']}</h5>
        </div>

        <div class="daily-high">
          <i class="wi wi-thermometer"></i> <h5>${dailyData['temperatureHigh']} &deg;</h5>
        </div>

        <div class="daily-low">
          <i class="wi wi-thermometer-exterior"></i> <h5>${dailyData['temperatureLow']} &deg;</h5>
        </div>
      </div>
    `);
  }
  $('#daily').css('display', 'inherit');
}

// Event listener for a new location search, for button click
$('#location-search').on('click', function() {
  var location = $('#location').val();
  getWeatherData(location);
});

// Event listener for enter press on the search bar itself
$('#location').keypress(function(event) {
  if(event.which == 13) {
    var location = $('#location').val();
    getWeatherData(location);
  }
});
