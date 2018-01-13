var chai = require('chai');
var should = chai.should();
var hello = require('../dev/hello');

describe('code.js', function() {
    context('echo', function() {
        it('should return Hello yamamoto when the value is yamamoto', function() {
            hello('yamamoto').should.equal('Hello yamamoto');
        });
    });
});
