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

const GetOffsetDay = require('./Parser/GetOffsetDay');
const Weather = require('./Weather');
global.doPost = function (request) {
    const log = global.log;
    log.v('doPost');
    log.v(request);

    const contents = JSON.parse(request.postData.contents);
    const line = new Line();
    const messages = line.parse(contents);

    if (messages) {
        // process at line message.
        log.v(messages);
        messages.map(m => {
            log.v(m);
            const offsetDay = GetOffsetDay(m.message);
            log.v(JSON.stringify(offsetDay));
            if (offsetDay.length > 0) {
                const w = new Weather();
                const message = offsetDay.map(d => {
                    log.v(d + '日後の天気を返答');
                    const target = new Date();
                    target.setDate(target.getDate() + d);
                    return [JSON.stringify(target).substring(1, 11) + 'の天気']
                        .concat(
                        w.getIncludeGroup('MTB', d).map(x => `${x.city}:${x.weather.short}`)
                        ).join('\n');
                }).join('\n\n');

                log.v(`返答内容: ${message}`);
                line.send(message, m.token);
            }
        });

        return ContentService
            .createTextOutput(JSON.stringify({ content: 'post ok' }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
        .createTextOutput(JSON.stringify('Can\'nt proceed'))
        .setMimeType(ContentService.MimeType.JSON);
};

global.test = require('./test');