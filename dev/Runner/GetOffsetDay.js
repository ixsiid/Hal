const Date = require('date-with-offset');
const zone = require('../../secret/Locale').timezoneOffset;
const Logger = require('../Logger');

module.exports = function (text) {
    const log = new Logger('GetOffsetDay');
    let result = [];
    [{
        reg: /([今来])週の([日月火水木金土])曜/,
        value: function (match) {
            return [Math.max(0, ({ '今': 0, '来': 7 })[match[1]] + '日月火水木金土'.indexOf(match[2]) - new Date(zone).getDay())];
        },
    }, {
        reg: /([今来])週/,
        value: function (match) {
            return [Math.max(0, ({ '今': 6, '来': 13 })[match[1]] - new Date(zone).getDay())];
        },
    }, {
        reg: /([日月火水木金土])曜/,
        value: function (match) {
            return [(7 + '日月火水木金土'.indexOf(match[1]) - new Date(zone).getDay()) % 7];
        },
    }, {
        reg: /([0-9]+)日/,
        value: function (match) {
            const d = parseInt(match[1]);
            const today = new Date(zone);
            const target = new Date(zone);
            if (today.getDate() > d) target.setMonth(target.getMonth() + 1);
            target.setDate(d);
            return [Math.floor((target - today) / 1000 / 60 / 60 / 24)];
        },
    }, {
        reg: /明(後?)日/,
        value: function (match) {
            return [match[1] ? 2 : 1];
        },
    }].find(function (x) {
        const match = x.reg.exec(text);
        if (!match) return false;
        log.i(match);
        result = x.value(match);
        return true;
    });
    log.i(JSON.stringify(result));
    return result;
};