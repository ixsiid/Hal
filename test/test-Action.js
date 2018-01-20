const assert = require('power-assert');
const glib = require('./GLibMock.js');

// Can't test directory in dev/*.js
// It should use in src/bundle.js

/*
const query = require('./QueryGenerator');

describe('Action', function () {
    this.timeout(5000);
    const r = glib.doGet(query('GET', 'action=hello&token=SECRET'));
    it('should send Line message, and return empty Object', function () {
        assert.equal(r.content, '"{}"');
    });
});
*/