// This file is in the entry point in your webpack config.

const url = 'http://sweater-weather1141.herokuapp.com';
var weatherData = {}
var lastLookup = '';
const weatherIcons = {
  'clear-day': 'wi-day-sunny',
  'clear-night': 'wi-night-clear',
  'rain': 'wi-showers',
  'snow': 'wi-snow',
  'sleet': 'wi-sleet',
  'wind': 'wi-windy',
  'fog': 'wi-fog',
  'cloudy': 'wi-cloudy',
  'partly-cloudy-day': 'wi-day-cloudy',
  'partly-cloudy-night': 'wi-night-cloudy'
}

// ***** Cookie Functions *****

const checkCookies = () => {
  let username = getCookie('username');
  let apiKey = getCookie('apiKey');

  if((username !== undefined) && (apiKey !== undefined)) {
    loginUser(apiKey, username);
  } else {
    $('#logged-out-menu').css('display', 'inherit');
    $('#logged-in-menu').css('display', 'none');
    $('#favorite-link').css('display', 'none');
  }

  let lastLookup = getCookie('lastLookup');

  if (lastLookup !== undefined) {
    getWeatherData(lastLookup);
  }
}

const getCookie = (name) => {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// ***** Authorization Functions

const logout = () => {
  document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `apiKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  $('#favorites').html('');

  checkCookies();
}

const loginUser = (apiKey, username) => {
  document.cookie = `username=${username}; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/`;
  document.cookie = `apiKey=${apiKey}; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/`;

  $('#login-modal').css('display', 'none');
  $('#register-modal').css('display', 'none');
  $('#logged-out-menu').css('display', 'none');
  $('#logged-in-menu').css('display', 'inherit');
  $('#favorite-link').css('display', 'inherit');
  $('#logged-in-menu').children("h3").text(username);

  getFavorites();
}

const authenticateUser = (username, password) => {
  let formData = new FormData();

  formData.append('email', username);
  formData.append('password', password);

  fetch(`${url}/api/v1/sessions`, {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(response => loginUser(response['data']['attributes']['api_key'], username))
    .catch(error => console.error({error}));
}

// ***** Register User *****

const registerUser = (username, password, passwordConfirmation) => {
  let formData = new FormData();

  formData.append('email', username);
  formData.append('password', password);
  formData.append('password_confirmation', passwordConfirmation);

  fetch(`${url}/api/v1/users`, {
    method: 'POST',
    body: formData
  })
    .catch(error => console.log({error}))
    .then(response => response.json())
    .then(apiKey => loginUser(apiKey['data']['attributes']['api_key'], username))
}

// ***** Custom Classes *****

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

// Class that formats dates based on a UNIX timestamp input
class DateFormatter {
  constructor(timestamp) {
    this.dateTime = new Date(timestamp * 1000);
  }

  currentFormat() {
    let hourObject = this.formatHours(this.dateTime.getHours());
    let currentMinutes = ('0'+this.dateTime.getMinutes()).slice(-2);
    let currentMonth = this.dateTime.getMonth() + 1;
    let currentDate = this.dateTime.getDate();

    let dateString = `${hourObject['hour']}:${currentMinutes} ${hourObject['amPm']}, ${currentMonth}/${currentDate}`;

    return dateString;
  }

  hourlyFormat() {
    let hourObject = this.formatHours(this.dateTime.getHours());

    let dateString = `${hourObject['hour']} ${hourObject['amPm']}`;

    return dateString;
  }

  formatWeekday() {
    let dayOfWeek = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    }

    return dayOfWeek[this.dateTime.getDay()];
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

// ***** Weather Lookup Functions *****

// GET request for weather data based on inputted location
const getWeatherData = (location) => {
  lastLookup = location;
  document.cookie = `lastLookup=${lastLookup}`;

  fetch(`${url}/api/v1/forecast?location=${location}`)
    .catch(error => console.error({ error}))
    .then(response => response.json())
    .then(data => weatherData = new WeatherData(data))
    .then(updateCurrentData)
    .then(updateHourlyData)
    .then(updateDailyData);
};

// Update Current Weather
const updateCurrentData = () => {
  let stringTime = new DateFormatter(weatherData.currentForecast()['time']);

  $('#summary-icon').addClass(weatherIcons[weatherData.currentForecast()['icon']]);
  $('#details-icon').addClass(weatherIcons[weatherData.currentForecast()['icon']]);
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
    let hourlyData = weatherData.hourlyForecast()['data'][i];
    let stringTime = new DateFormatter(hourlyData['time']);

    $('.hourly-container').append(`
      <div class="hourly-item">
        <h5>${stringTime.hourlyFormat()}</h5>
        <h1><i class="wi ${weatherIcons[hourlyData['icon']]}"></i></h1>
        <h5>${Math.floor(hourlyData['temperature'])}&deg;</h5>
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
    let dateString = new DateFormatter(dailyData['time']);

    $('#daily').append(`
      <div class="daily-container">
        <div class="daily-day">
          <h5>${dateString.formatWeekday()}</h5>
        </div>

        <div class="daily-status">
          <i class="wi ${weatherIcons[dailyData['icon']]}"></i><h5>${dailyData['summary']}</h5>
        </div>

        <div class="daily-precip">
          <i class="wi wi-raindrop"></i><h5>${dailyData['precipProbability']}</h5>
        </div>

        <div class="daily-high">
          <i class="wi wi-thermometer"></i> <h5>${Math.floor(dailyData['temperatureHigh'])} &deg;</h5>
        </div>

        <div class="daily-low">
          <i class="wi wi-thermometer-exterior"></i> <h5>${Math.floor(dailyData['temperatureLow'])} &deg;</h5>
        </div>
      </div>
    `);
  }
  $('#daily').css('display', 'inherit');
}

// ***** User Favorite Functions *****

// API call to get user favorites
const getFavorites = () => {
  fetch(`${url}/api/v1/favorites?api_key=${getCookie('apiKey')}`)
    .then(response => response.json())
    .then(response => displayFavorites(response))
    .catch(error => console.log({error}));
}

// Function that adds user favorites based on location
const addToFavorites = (location) => {
  let formData = new FormData();

  formData.append('location', lastLookup);
  formData.append('api_key', getCookie('apiKey'));

  fetch(`${url}/api/v1/favorites`, {
    method: 'POST',
    body: formData
  })
    .then(alert('Added to Favorites'))
    .then(getFavorites())
    .catch(error => console.error({error}));
}

// Takes an object of user favorites and displays them on the page
const displayFavorites = (favorites) => {
  $('#favorites').html('');

  let favoriteList = favorites['data'];

  for(let i = 0; i < favoriteList.length; i++) {
    $('#favorites').append(`
      <a href="javascript:void(0)" class="remove-images"><img id="${favoriteList[i]['meta']['data']['id']}" src="./assets/subtract.svg"/></a>
      <a href="javascript:void(0)" class="favorite-links" id="${favoriteList[i]['meta']['data']['id']}">${favoriteList[i]['meta']['data']['id']}</a><br/>
    `);
  }
}

const removeFavorite = (location) => {
  let formData = new FormData();
  location = location.replace(/  +/g, ' ');

  formData.append('location', location);
  formData.append('api_key', getCookie('apiKey'));

  fetch(`${url}/api/v1/favorites`, {
    method: 'DELETE',
    body: formData
  })
    .then(alert(`Removed ${location} from favorites`))
    .then(getFavorites)
    .catch(error => console.log({error}));
}

// ***** EVENT LISTENERS *****

// Event listener for displaying favorite by clicking on its link
$('#favorites').on('click', '.favorite-links', function(event) {
  getWeatherData(event.target.id);
});

// Event listener for removing a favorite location
$('#favorites').on('click', '.remove-images', function(event) {
  removeFavorite(event.target.id);
});

// Event listener for login form
$('#login-form').submit(function(event) {
  event.preventDefault();

  let username = $('#user-login').val();
  let password = $('#pass-login').val();

  authenticateUser(username, password);
});

// Event listener for register form
$('#register-form').submit(function(event) {
  $('#register-error').html('');

  event.preventDefault();

  let username = $('#user-register').val();
  let password = $('#pass-register').val();
  let passwordConfirmation = $('#confirm-pass-register').val();

  if ((password === '') || (passwordConfirmation === '') || (username === '')) {
    $('#register-error').text('All fields are required.');
  } else if ((password !== passwordConfirmation)) {
    $('#register-error').text('Passwords must match.');
  } else {
    registerUser(username, password, passwordConfirmation);
  }
});

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

// Event listener for adding to favorites
$('#favorite-link').on('click', function() {
  addToFavorites(lastLookup);
});

// Event listener for logging out
$('#logout-btn').on('click', function() {
  logout();
});


checkCookies();
