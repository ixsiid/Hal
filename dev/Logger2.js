const Date = require('date-with-offset');
const zone = require('../secret/Locale').timezoneOffset;

module.exports = function (tag) {
    const self = this;
    const fileId = require('../secret/Google.js').log2;

    const file = DocumentApp.openById(fileId);
    const body = file.getBody();

    const levels = 'newidv';
    this.level = 7;

    const put = (level, object) => {
        if (self.level < levels.indexOf(level)) return;

        const text = typeof object === 'string' ? object : JSON.stringify(object);
        const datetime = new Date(zone).toISOString().substring(0, 19);
        body.appendParagraph('[' + datetime + '] (' + tag + ') ' + level.toUpperCase() + ': ' + text);
    };

    [].map.call(levels, level => {
        self[level] = object => put(level, object);
    });
};