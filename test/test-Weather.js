const assert = require('power-assert');
const Weather = require('../dev/Weather');
const Location = require('../dev/Location');
const glib = require('../GLibMock.js');

describe('Fetch', function () {
    this.timeout(5000);
    const r = glib.test();
    console.log(r.location);
    console.log(r.weathre);
    console.log(r.forecast);
    it('Get www.google.com', function () {
        assert.equal(glib.test(), undefined);
    });
});

describe('Weather', function () {
    const location = new Location({ longitude: 120, latitude: 90 });
    it('should return to Location Object', () => {
        assert.equal(location.toString(), 'Location Object');
    });
    it('should return to Weather Object', () => {
        const weather = new Weather();
        const forecast = weather.get(location, 2);
        console.log(forecast);
        assert.equal(forecast, 3);
    });
});
