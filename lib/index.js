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

// GET request for weather data based on inputted location
const getWeatherData = (location) => {
  fetch(`${url}/api/v1/forecast?location=${location}`)
    .then(response => response.json())
    .then(data => weatherData = new WeatherData(data))
    .then(updateCurrentData)
    .catch(error => console.error({ error}));
};

// Update Current Weather
const updateCurrentData = () => {
  $('#currently-summary').text(weatherData.currentForecast()['summary']);
  $('#currently-temperature').text(Math.floor(weatherData.currentForecast()['temperature']));
  $('#daily-temperature-high').text(Math.floor(weatherData.dailyForecast()['data'][0]['temperatureHigh']));
  $('#daily-temperature-low').text(Math.floor(weatherData.dailyForecast()['data'][0]['temperatureLow']));
  $('#current-location').text(weatherData.currentLocation());
  $('#current-time').text(formatCurrentTime(weatherData.currentForecast()['time']));
};

// Format time for Current box -> '11:11 PM, 10/31'
const formatCurrentTime = (currentTime) => {
  let dateTime = new Date(currentTime * 1000);
  let currentHour = dateTime.getHours();

  let amPm = '';

  currentHour = currentHour + 1;
  
  if (currentHour === 24) {
    currentHour = currentHour - 12;
    amPm = 'AM';
  } else if (currentHour > 12) {
    currentHour = currentHour - 12;
    amPm = 'PM';
  } else {
    amPm = 'AM';
  }

  let currentMinutes = ('0'+dateTime.getMinutes()).slice(-2);
  let currentMonth = dateTime.getMonth() + 1;
  let currentDate = dateTime.getDate();

  let dateString = `${currentHour}:${currentMinutes} ${amPm}, ${currentMonth}/${currentDate}`;

  return dateString;
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
