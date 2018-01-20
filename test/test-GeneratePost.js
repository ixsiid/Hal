const assert = require('power-assert');
const glib = require('./GLibMock.js');

// Can't test directory in dev/*.js
// It should use in src/bundle.js

const query = require('./QueryGenerator');

describe('Action', function () {
    this.timeout(5000);
    const q = query('LINE', '今週の天気');
    const r = glib.doPost(q);
    it('should send Line message, and return empty Object', function () {
        assert.deepEqual(JSON.parse(r.content), {content:'post ok'});
    });
});
