/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// This file is in the entry point in your webpack config.

	var url = 'http://sweater-weather1141.herokuapp.com';
	var weatherData = {};
	var lastLookup = '';
	var weatherIcons = {
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

	  // ***** Cookie Functions *****

	};var checkCookies = function checkCookies() {
	  var username = getCookie('username');
	  var apiKey = getCookie('apiKey');

	  if (username !== undefined && apiKey !== undefined) {
	    loginUser(apiKey, username);
	  } else {
	    $('#logged-out-menu').css('display', 'inherit');
	    $('#logged-in-menu').css('display', 'none');
	    $('#favorite-link').css('display', 'none');
	  }

	  var lastLookup = getCookie('lastLookup');

	  if (lastLookup !== undefined) {
	    getWeatherData(lastLookup);
	  }
	};

	var getCookie = function getCookie(name) {
	  var value = "; " + document.cookie;
	  var parts = value.split("; " + name + "=");
	  if (parts.length == 2) return parts.pop().split(";").shift();
	};

	// ***** Authorization Functions

	var logout = function logout() {
	  document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
	  document.cookie = 'apiKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
	  $('#favorites').html('');

	  checkCookies();
	};

	var loginUser = function loginUser(apiKey, username) {
	  document.cookie = 'username=' + username + '; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/';
	  document.cookie = 'apiKey=' + apiKey + '; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/';

	  $('#login-modal').css('display', 'none');
	  $('#register-modal').css('display', 'none');
	  $('#logged-out-menu').css('display', 'none');
	  $('#logged-in-menu').css('display', 'inherit');
	  $('#favorite-link').css('display', 'inherit');
	  $('#logged-in-menu').children("h3").text(username);

	  getFavorites();
	};

	var authenticateUser = function authenticateUser(username, password) {
	  var formData = new FormData();

	  formData.append('email', username);
	  formData.append('password', password);

	  fetch(url + '/api/v1/sessions', {
	    method: 'POST',
	    body: formData
	  }).then(function (response) {
	    return response.json();
	  }).then(function (response) {
	    return loginUser(response['data']['attributes']['api_key'], username);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	// ***** Register User *****

	var registerUser = function registerUser(username, password, passwordConfirmation) {
	  var formData = new FormData();

	  formData.append('email', username);
	  formData.append('password', password);
	  formData.append('password_confirmation', passwordConfirmation);

	  fetch(url + '/api/v1/users', {
	    method: 'POST',
	    body: formData
	  }).catch(function (error) {
	    return console.log({ error: error });
	  }).then(function (response) {
	    return response.json();
	  }).then(function (apiKey) {
	    return loginUser(apiKey['data']['attributes']['api_key'], username);
	  });
	};

	// ***** Custom Classes *****

	// Weather Data class

	var WeatherData = function () {
	  function WeatherData(data) {
	    _classCallCheck(this, WeatherData);

	    this.data = data;
	  }

	  _createClass(WeatherData, [{
	    key: 'currentLocation',
	    value: function currentLocation() {
	      return this.data['data']['id'];
	    }
	  }, {
	    key: 'currentForecast',
	    value: function currentForecast() {
	      return this.data['data']['attributes']['currently'];
	    }
	  }, {
	    key: 'hourlyForecast',
	    value: function hourlyForecast() {
	      return this.data['data']['attributes']['hourly'];
	    }
	  }, {
	    key: 'dailyForecast',
	    value: function dailyForecast() {
	      return this.data['data']['attributes']['daily'];
	    }
	  }]);

	  return WeatherData;
	}();

	// Class that formats dates based on a UNIX timestamp input


	var DateFormatter = function () {
	  function DateFormatter(timestamp) {
	    _classCallCheck(this, DateFormatter);

	    this.dateTime = new Date(timestamp * 1000);
	  }

	  _createClass(DateFormatter, [{
	    key: 'currentFormat',
	    value: function currentFormat() {
	      var hourObject = this.formatHours(this.dateTime.getHours());
	      var currentMinutes = ('0' + this.dateTime.getMinutes()).slice(-2);
	      var currentMonth = this.dateTime.getMonth() + 1;
	      var currentDate = this.dateTime.getDate();

	      var dateString = hourObject['hour'] + ':' + currentMinutes + ' ' + hourObject['amPm'] + ', ' + currentMonth + '/' + currentDate;

	      return dateString;
	    }
	  }, {
	    key: 'hourlyFormat',
	    value: function hourlyFormat() {
	      var hourObject = this.formatHours(this.dateTime.getHours());

	      var dateString = hourObject['hour'] + ' ' + hourObject['amPm'];

	      return dateString;
	    }
	  }, {
	    key: 'formatWeekday',
	    value: function formatWeekday() {
	      var dayOfWeek = {
	        0: 'Sunday',
	        1: 'Monday',
	        2: 'Tuesday',
	        3: 'Wednesday',
	        4: 'Thursday',
	        5: 'Friday',
	        6: 'Saturday'
	      };

	      return dayOfWeek[this.dateTime.getDay()];
	    }
	  }, {
	    key: 'formatHours',
	    value: function formatHours(hour) {
	      var amPm = 'AM';

	      if (hour >= 12) {
	        hour = hour - 12;
	        amPm = 'PM';
	      }

	      if (hour === 0) {
	        hour = 12;
	      }

	      return { hour: hour, amPm: amPm };
	    }
	  }]);

	  return DateFormatter;
	}();

	// ***** Weather Lookup Functions *****

	// GET request for weather data based on inputted location


	var getWeatherData = function getWeatherData(location) {
	  lastLookup = location;
	  document.cookie = 'lastLookup=' + lastLookup;

	  fetch(url + '/api/v1/forecast?location=' + location).catch(function (error) {
	    return console.error({ error: error });
	  }).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    return weatherData = new WeatherData(data);
	  }).then(updateCurrentData).then(updateHourlyData).then(updateDailyData);
	};

	// Update Current Weather
	var updateCurrentData = function updateCurrentData() {
	  var stringTime = new DateFormatter(weatherData.currentForecast()['time']);

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
	var updateHourlyData = function updateHourlyData() {
	  $('.hourly-container').html('');

	  for (var i = 0; i < 12; i++) {
	    var hourlyData = weatherData.hourlyForecast()['data'][i];
	    var stringTime = new DateFormatter(hourlyData['time']);

	    $('.hourly-container').append('\n      <div class="hourly-item">\n        <h5>' + stringTime.hourlyFormat() + '</h5>\n        <h1><i class="wi ' + weatherIcons[hourlyData['icon']] + '"></i></h1>\n        <h5>' + Math.floor(hourlyData['temperature']) + '&deg;</h5>\n      </div>\n    ');
	  }
	  $('#hourly').css('display', 'inherit');
	};

	// Update Daily Weather
	var updateDailyData = function updateDailyData() {
	  $('#daily').html('');

	  for (var i = 0; i < 7; i++) {
	    var dailyData = weatherData.dailyForecast()['data'][i];
	    var dateString = new DateFormatter(dailyData['time']);

	    $('#daily').append('\n      <div class="daily-container">\n        <div class="daily-day">\n          <h5>' + dateString.formatWeekday() + '</h5>\n        </div>\n\n        <div class="daily-status">\n          <i class="wi ' + weatherIcons[dailyData['icon']] + '"></i><h5>' + dailyData['summary'] + '</h5>\n        </div>\n\n        <div class="daily-precip">\n          <i class="wi wi-raindrop"></i><h5>' + dailyData['precipProbability'] + '</h5>\n        </div>\n\n        <div class="daily-high">\n          <i class="wi wi-thermometer"></i> <h5>' + Math.floor(dailyData['temperatureHigh']) + ' &deg;</h5>\n        </div>\n\n        <div class="daily-low">\n          <i class="wi wi-thermometer-exterior"></i> <h5>' + Math.floor(dailyData['temperatureLow']) + ' &deg;</h5>\n        </div>\n      </div>\n    ');
	  }
	  $('#daily').css('display', 'inherit');
	};

	// ***** User Favorite Functions *****

	// API call to get user favorites
	var getFavorites = function getFavorites() {
	  fetch(url + '/api/v1/favorites?api_key=' + getCookie('apiKey')).then(function (response) {
	    return response.json();
	  }).then(function (response) {
	    return displayFavorites(response);
	  }).catch(function (error) {
	    return console.log({ error: error });
	  });
	};

	// Function that adds user favorites based on location
	var addToFavorites = function addToFavorites(location) {
	  var formData = new FormData();

	  formData.append('location', lastLookup);
	  formData.append('api_key', getCookie('apiKey'));

	  fetch(url + '/api/v1/favorites', {
	    method: 'POST',
	    body: formData
	  }).then(alert('Added to Favorites')).then(getFavorites()).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	// Takes an object of user favorites and displays them on the page
	var displayFavorites = function displayFavorites(favorites) {
	  $('#favorites').html('');

	  var favoriteList = favorites['data'];

	  for (var i = 0; i < favoriteList.length; i++) {
	    $('#favorites').append('\n      <a href="javascript:void(0)" class="remove-images"><img id="' + favoriteList[i]['meta']['data']['id'] + '" src="./assets/subtract.svg"/></a>\n      <a href="javascript:void(0)" class="favorite-links" id="' + favoriteList[i]['meta']['data']['id'] + '">' + favoriteList[i]['meta']['data']['id'] + '</a><br/>\n    ');
	  }
	};

	var removeFavorite = function removeFavorite(location) {
	  var formData = new FormData();
	  location = location.replace(/  +/g, ' ');

	  formData.append('location', location);
	  formData.append('api_key', getCookie('apiKey'));

	  fetch(url + '/api/v1/favorites', {
	    method: 'DELETE',
	    body: formData
	  }).then(alert('Removed ' + location + ' from favorites')).then(getFavorites).catch(function (error) {
	    return console.log({ error: error });
	  });
	};

	// ***** EVENT LISTENERS *****

	// Event listener for displaying favorite by clicking on its link
	$('#favorites').on('click', '.favorite-links', function (event) {
	  getWeatherData(event.target.id);
	});

	// Event listener for removing a favorite location
	$('#favorites').on('click', '.remove-images', function (event) {
	  removeFavorite(event.target.id);
	});

	// Event listener for login form
	$('#login-form').submit(function (event) {
	  event.preventDefault();

	  var username = $('#user-login').val();
	  var password = $('#pass-login').val();

	  authenticateUser(username, password);
	});

	// Event listener for register form
	$('#register-form').submit(function (event) {
	  $('#register-error').html('');

	  event.preventDefault();

	  var username = $('#user-register').val();
	  var password = $('#pass-register').val();
	  var passwordConfirmation = $('#confirm-pass-register').val();

	  if (password === '' || passwordConfirmation === '' || username === '') {
	    $('#register-error').text('All fields are required.');
	  } else if (password !== passwordConfirmation) {
	    $('#register-error').text('Passwords must match.');
	  } else {
	    registerUser(username, password, passwordConfirmation);
	  }
	});

	// Event listener for a new location search, for button click
	$('#location-search').on('click', function () {
	  var location = $('#location').val();
	  getWeatherData(location);
	});

	// Event listener for enter press on the search bar itself
	$('#location').keypress(function (event) {
	  if (event.which == 13) {
	    var location = $('#location').val();
	    getWeatherData(location);
	  }
	});

	// Event listener for adding to favorites
	$('#favorite-link').on('click', function () {
	  addToFavorites(lastLookup);
	});

	// Event listener for logging out
	$('#logout-btn').on('click', function () {
	  logout();
	});

	checkCookies();

/***/ })
/******/ ]);