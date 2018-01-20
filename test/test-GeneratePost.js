const assert = require('power-assert');
const glib = require('./GLibMock.js');

// Can't test directory in dev/*.js
// It should use in src/bundle.js



const query = require('./QueryGenerator');

describe('Weather', function () {
    this.timeout(5000);
    const q = query('LINE', '今週の天気');
    const r = glib.doPost(q);
    it('should send Line message weather forecast, and return post ok', function () {
        assert.deepEqual(JSON.parse(r.content), {content:'post ok'});
    });
});
