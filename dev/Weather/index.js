const Logger = require('../Logger');
const Forecast = require('./Forecast');
const Query = require('../Query');

module.exports = function () {
    const log = new Logger('WEATHER');
    const Forecast = require('./Forecast');
    log.v('Create Weather Object');

    const configure = require('../../secret/OpenWeatherMap');
    const KEY = configure.key;
    const locations = configure.locations;

    const q = new Query('https://api.openweathermap.org/data/2.5/forecast/', `APPID=${KEY}`);

    this.get = function (geo, offsetDay) {
        if (offsetDay < 0 || offsetDay > 13)
            throw new Error(`Range over offset days. req: (0-13), value: ${offsetDay}`);

        const url = q.get('daily', `lat=${geo.lat}&lon=${geo.lon}&cnt=${offsetDay + 1}`);
        log.v(url);
        const contents = JSON.parse(UrlFetchApp.fetch(url, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            method: 'get',
        }).getContentText());
        log.v(contents);
        return contents.list.sort(function (a, b) {
            return b.dt - a.dt;
        }).filter(function (v, i, a) {
            return i === 0;
        }).splice(0, 1).map(function (v) {
            return new Forecast(v);
        })[0];
    };

    this.getIncludeGroup = function (group, offsetDay) {
        return locations
            .filter(x => x.group.indexOf(group) >= 0)
            .map(x => ({
                city: x.name,
                weather: this.get(x.location.openWeatherMap(), offsetDay)
            }));
    };
};
