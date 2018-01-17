const Logger = require('./Logger');
const Location = require('./Location');
const Weather = require('./Weather');

module.exports = function () {
    const location = new Location({ longitude: 120, latitude: 90 });
    const weather = new Weather();
    const forecast = weather.get(location.openWeatherMap(), 2);
    
    return {
        location,
        weather,
        forecast,
    };
};
