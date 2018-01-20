const Date = require('date-with-offset');
const zone = require('../../secret/Locale').timezoneOffset;

const BaseRunner = require('./BaseRunner');
const Line = require('../Line');
const Weather = require('../Weather');
const Logger = require('../Logger');
const GetOffsetDay = require('./GetOffsetDay');

module.exports = function (contents) {
    const base = new BaseRunner(contents);
    const line = new Line();
    const log = new Logger('LINE WEATHER');

    base.match = () => {
        this.messages = line.parse(contents);
        log.v(this.messages);
        return this.messages;
    };

    base.run = () => {
        this.messages.map(m => {
            log.v(m);
            const offsetDay = GetOffsetDay(m.message);
            log.v(JSON.stringify(offsetDay));
            if (offsetDay.length > 0) {
                const w = new Weather();
                const message = offsetDay.map(d => {
                    log.v(d + '日後の天気を返答');
                    const target = new Date(zone);
                    target.setDate(target.getDate() + d);
                    return [JSON.stringify(target).substring(1, 11) + 'の天気'].concat(
                        w.getIncludeGroup('MTB', d).map(x => `${x.city}:${x.weather.short}`)
                    ).join('\n');
                }).join('\n\n');

                log.v(`返答内容: ${message}`);
                line.send(message, m.token);
            }
        });
        return { content: 'post ok' };
    };

    base.toString = () => 'Reply weather by Line runner';

    return base;
};