const assert = require('power-assert');
const glib = require('./GLibMock.js');

// Can't test directory in dev/*.js
// It should use in src/bundle.js



const query = require('./QueryGenerator');

describe('proceed Line message', function () {
    this.timeout(5000);
    /*
    it('should send Line message weather forecast, and return post ok', function () {
        const q = query('LINE', '今週の天気');
        const r = glib.doPost(q);
        assert.deepEqual(JSON.parse(r.content), {content:'post ok'});
    });
    
    it('should send Line message もしかして: ', function () {
        const q = query('LINE', '達治');
        const r = glib.doPost(q);
        assert.deepEqual(JSON.parse(r.content), {content:'post ok'});
    });
    
    it('should send Line message Hal help', function () {
        const q = query('LINE', 'Hal help');
        const r = glib.doPost(q);
        assert.deepEqual(JSON.parse(r.content), {content:'post ok'});
    });

    */
});
