const Line = require('./Line');
const Logger = require('./Logger');

global.log = new Logger('MAIN');
global.log.level = 10;
global.token = require('../secret/Google').token;

global.action = {};
global.action.ip = function (query) {
};

global.action.hello = function (query) {
    const message = query.parameter.message || 'Hello, world!';

    line = new Line();
    line.send(message);

    return true;
};

global.doGet = function (query) {
    const log = global.log;
    log.v('doGet');
    log.v(JSON.stringify(query));
    const action = query.parameter.action;
    if (query.parameter.token !== global.token[action]) {
        log.e('Bad token access.');
        log.v(JSON.stringify(query));
        return false;
    }

    return global.action[action](query);
};

global.doPost = function (request) {
    const log = global.log;
    log.v('doPost');
    return true;
};

global.test = require('./test');