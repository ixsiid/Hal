const Logger = require('./Logger');
const Location = require('./Location');
const Weather = require('./Weather');

module.exports = {
    weather: function (latitude, longitude, offsetDay) {
        const location = new Location({ longitude, latitude });
        const weather = new Weather();
        const forecast = weather.get(location.openWeatherMap(), offsetDay);

        return {
            location,
            weather,
            forecast,
        };
    },
};
