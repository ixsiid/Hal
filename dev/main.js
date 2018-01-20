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

    const line = new Line();
    return line.send(message);
};

global.action.sheet = function (query) {
    const Logger2 = require('./Logger2');
    const log = new Logger2('test');
    log.e('Error message');
    log.v(['Owner', 'verbose message']);
    log.v(['owner', {content: 'aaa'}]);
    log.i({sender: 'owner', message: 'info'});
};

global.doGet = function (query) {
    const log = global.log;
    log.v('doGet');
    log.v(JSON.stringify(query));
    const action = query.parameter.action;
    if (query.parameter.token !== global.token[action]) {
        log.e('Bad token access.');
        log.v(JSON.stringify(query));
        return ContentService
            .createTextOutput(JSON.stringify({ content: 'Bad access' }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
        .createTextOutput(JSON.stringify(global.action[action](query)))
        .setMimeType(ContentService.MimeType.JSON);
};

global.doPost = function (request) {
    const log = global.log;
    log.v('doPost');
    log.v('request');
    return true;
};

global.test = require('./test');