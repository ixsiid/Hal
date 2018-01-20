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
        const messages = line.parse(contents);
        if (!messages) return false;
        this.offsetDays = messages.map(m => ({
            days: GetOffsetDay(m.message),
            token: m.token
        })).filter(x => x.days.length > 0);

        log.v(JSON.stringify(this.messages));
        return this.offsetDays.length > 0;
    };

    base.run = () => {
        this.offsetDays.map(offsetDay => {
            const w = new Weather();
            const message = offsetDay.days.map(d => {
                log.v(d + '日後の天気を返答');
                const target = new Date(zone);
                target.setDate(target.getDate() + d);
                return [target.toISOString().substring(0, 10) + 'の天気'].concat(
                    w.getIncludeGroup('MTB', d).map(x => `${x.city}:${x.weather.short}`)
                ).join('\n');
            }).join('\n\n');

            log.v(`返答内容: ${message}`);
            line.send(message, offsetDay.token);
        });
        return { content: 'post ok' };
    };

    base.toString = () => 'Reply weather by Line runner';

    return base;
};