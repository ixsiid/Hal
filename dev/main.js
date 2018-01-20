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
    log.v(['owner', { content: 'aaa' }]);
    log.i({ sender: 'owner', message: 'info' });
};

global.doGet = function (query) {
    const log = global.log;
    log.v(['doGet', query]);
    
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

const Runner = require('./Runner');

global.doPost = function (request) {
    const log = global.log;
    log.v(['doPost', request]);

    const contents = JSON.parse(request.postData.contents);
    log.v(['post contents', contents]);
    const runner = Runner.map(x => new x(contents)).filter(x => x.match())[0];

    log.v(runner ? runner.toString() : 'no runnner');

    return ContentService
        .createTextOutput(JSON.stringify(runner ? runner.run() : { content: 'no runner' }))
        .setMimeType(ContentService.MimeType.JSON);
};

global.AnyHours = function () {
    const Date = require('date-with-offset');
    const zone = require('../secret/Locale').timezoneOffset;

    const log = new Logger('HOURS');
    const date = new Date(zone);
    const time = Math.floor(date.getHours() + date.getMinutes() / 60 + 0.3);
    log.v(`Date: [${date}], Time: [${time}]`);
    if (time === 7) {
        const line = new Line();
        log.i(line.send('おはよー'));
    }
};

global.test = require('./test');