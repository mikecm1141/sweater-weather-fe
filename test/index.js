const assert = require('chai').assert
const getWeatherData = require('../lib/index.js')

describe('Weather search', function() {
  context('based on location', function() {
    it('returns an object with weather data', function() {
      var weatherData = getWeatherData('Denver, CO');

      assert.hasAnyKeys(weatherData, ['attributes', 'type', 'id']);
    });
  });
});
