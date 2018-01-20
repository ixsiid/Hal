const Date = require('date-with-offset');
const zone = require('../secret/Locale').timezoneOffset;

const assert = require('power-assert');
const glib = require('./GLibMock.js');

// Can't test directory in dev/*.js
// It should use in src/bundle.js

describe('Weather', function () {
    this.timeout(5000);
    const offsetDay = 2;
    const latitude = 36.52;
    const longitude = 139.71;
    const targetDay = (() => {
        const d = new Date(zone);
        d.setDate(d.getDate() + offsetDay);
        return d;
    })();
    const r = glib.test.weather(latitude, longitude, offsetDay);

    it('Get 2 after forecast', function () {
        assert.deepEqual(r.location.openWeatherMap(), { lat: latitude, lon: longitude });
        assert.equal(r.forecast.dateShort, `${targetDay.getMonth() + 1}/${targetDay.getDate()}`);
    });
});
