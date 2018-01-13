const Line = require('./Line');

global.log = new (require('./Logger'))('MAIN');
global.log.level = 10;
global.token = require('../secret/Google').token;


global.doGet = function (query) {
    const log = global.log;
    log.v('doGet');
    if (query.parameter.token !== global.token) {
        global.log.e('Bad token access.');
        return false;
    }
    
    const message = query.parameter.message || 'Hallo, world!';

    line = new Line();
    line.send(message);
    return true;
};

global.doPost = function (request) {
    const log = global.log;
    log.v('doPost');
    return true;
};
