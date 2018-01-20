const assert = require('power-assert');
const glib = require('./GLibMock.js');

// Can't test directory in dev/*.js
// It should use in src/bundle.js

describe('AnyHours', function () {
    const r = glib.AnyHours();
});
